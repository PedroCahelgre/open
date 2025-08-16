import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

import { 
  Context, 
  Information, 
  CreateContextRequest, 
  UpdateContextRequest,
  CreateInformationRequest,
  UpdateInformationRequest,
  SearchFilters,
  DashboardStats
} from '../types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Data storage (JSON files)
const DATA_DIR = path.join(__dirname, '../../data');
const CONTEXTS_FILE = path.join(DATA_DIR, 'contexts.json');
const INFORMATION_FILE = path.join(DATA_DIR, 'information.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Data persistence functions
async function loadContexts(): Promise<Context[]> {
  try {
    const data = await fs.readFile(CONTEXTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveContexts(contexts: Context[]): Promise<void> {
  await fs.writeFile(CONTEXTS_FILE, JSON.stringify(contexts, null, 2));
}

async function loadInformation(): Promise<Information[]> {
  try {
    const data = await fs.readFile(INFORMATION_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveInformation(information: Information[]): Promise<void> {
  await fs.writeFile(INFORMATION_FILE, JSON.stringify(information, null, 2));
}

// Initialize data directory
ensureDataDir();

// API Routes

// Contexts
app.get('/api/contexts', async (_req, res) => {
  try {
    const contexts = await loadContexts();
    res.json(contexts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load contexts' });
  }
});

app.get('/api/contexts/:id', async (req, res) => {
  try {
    const contexts = await loadContexts();
    const context = contexts.find(c => c.id === req.params.id);
    
    if (!context) {
      return res.status(404).json({ error: 'Context not found' });
    }
    
    res.json(context);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load context' });
  }
});

app.post('/api/contexts', async (req, res) => {
  try {
    const data: CreateContextRequest = req.body;
    const contexts = await loadContexts();
    
    const newContext: Context = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      tags: data.tags || [],
      isActive: true,
      color: data.color || 'work',
      icon: data.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    contexts.push(newContext);
    await saveContexts(contexts);
    
    res.status(201).json(newContext);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create context' });
  }
});

app.put('/api/contexts/:id', async (req, res) => {
  try {
    const data: UpdateContextRequest = req.body;
    const contexts = await loadContexts();
    const index = contexts.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Context not found' });
    }
    
    contexts[index] = {
      ...contexts[index],
      ...data,
      updatedAt: new Date(),
    };
    
    await saveContexts(contexts);
    res.json(contexts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update context' });
  }
});

app.delete('/api/contexts/:id', async (req, res) => {
  try {
    const contexts = await loadContexts();
    const filteredContexts = contexts.filter(c => c.id !== req.params.id);
    
    if (filteredContexts.length === contexts.length) {
      return res.status(404).json({ error: 'Context not found' });
    }
    
    // Also delete related information
    const information = await loadInformation();
    const filteredInformation = information.filter(i => i.contextId !== req.params.id);
    
    await saveContexts(filteredContexts);
    await saveInformation(filteredInformation);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete context' });
  }
});

// Information
app.get('/api/information', async (req, res) => {
  try {
    const { contextId, type, tags, priority } = req.query;
    let information = await loadInformation();
    
    // Apply filters
    if (contextId) {
      information = information.filter(i => i.contextId === contextId);
    }
    if (type) {
      information = information.filter(i => i.type === type);
    }
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      information = information.filter(i => 
        tagArray.some(tag => i.tags.includes(tag as string))
      );
    }
    if (priority) {
      information = information.filter(i => i.priority === priority);
    }
    
    res.json(information);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load information' });
  }
});

app.get('/api/information/:id', async (req, res) => {
  try {
    const information = await loadInformation();
    const item = information.find(i => i.id === req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Information not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load information' });
  }
});

app.post('/api/information', async (req, res) => {
  try {
    const data: CreateInformationRequest = req.body;
    const information = await loadInformation();
    
    const newItem: Information = {
      id: uuidv4(),
      contextId: data.contextId,
      type: data.type,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      priority: data.priority,
      metadata: data.metadata || {},
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    information.push(newItem);
    await saveInformation(information);
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create information' });
  }
});

app.put('/api/information/:id', async (req, res) => {
  try {
    const data: UpdateInformationRequest = req.body;
    const information = await loadInformation();
    const index = information.findIndex(i => i.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Information not found' });
    }
    
    information[index] = {
      ...information[index],
      ...data,
      updatedAt: new Date(),
    };
    
    await saveInformation(information);
    res.json(information[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update information' });
  }
});

app.delete('/api/information/:id', async (req, res) => {
  try {
    const information = await loadInformation();
    const filteredInformation = information.filter(i => i.id !== req.params.id);
    
    if (filteredInformation.length === information.length) {
      return res.status(404).json({ error: 'Information not found' });
    }
    
    await saveInformation(filteredInformation);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete information' });
  }
});

// Search
app.post('/api/search', async (req, res) => {
  try {
    const filters: SearchFilters = req.body;
    let information = await loadInformation();
    
    // Apply search filters
    if (filters.contextId) {
      information = information.filter(i => i.contextId === filters.contextId);
    }
    if (filters.type) {
      information = information.filter(i => i.type === filters.type);
    }
    if (filters.tags && filters.tags.length > 0) {
      information = information.filter(i => 
        filters.tags!.some(tag => i.tags.includes(tag))
      );
    }
    if (filters.priority) {
      information = information.filter(i => i.priority === filters.priority);
    }
    if (filters.dateRange) {
      information = information.filter(i => 
        i.createdAt >= filters.dateRange!.start && 
        i.createdAt <= filters.dateRange!.end
      );
    }
    
    res.json({
      information,
      total: information.length,
      page: 1,
      limit: information.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search information' });
  }
});

// Dashboard stats
app.get('/api/dashboard', async (_req, res) => {
  try {
    const contexts = await loadContexts();
    const information = await loadInformation();
    
    const contextStats = contexts.map(context => {
      const contextInfo = information.filter(i => i.contextId === context.id);
      const tasks = contextInfo.filter(i => i.type === 'task');
      
      return {
        contextId: context.id,
        contextName: context.name,
        totalInformation: contextInfo.length,
        completedTasks: tasks.filter(t => t.isCompleted).length,
        pendingTasks: tasks.filter(t => !t.isCompleted).length,
        lastActivity: contextInfo.length > 0 
          ? new Date(Math.max(...contextInfo.map(i => i.updatedAt.getTime())))
          : context.updatedAt,
        timeSpent: 0, // Placeholder for future implementation
      };
    });
    
    const recentActivity = information
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10);
    
    const stats: DashboardStats = {
      totalContexts: contexts.length,
      activeContexts: contexts.filter(c => c.isActive).length,
      totalInformation: information.length,
      recentActivity,
      contextStats,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Context Manager Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});