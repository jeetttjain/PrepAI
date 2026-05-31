const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockChatResponses = [
  {
    keywords: ['horizontal', 'vertical', 'scaling'],
    response: "According to your **System Design Notes**, horizontal scaling adds more machines (nodes) to your resource pool, whereas vertical scaling adds power (CPU, RAM) to an existing server. System Design Notes emphasize that horizontal scaling is preferred for web-scale apps to prevent single points of failure, though it introduces network latency and synchronization issues."
  },
  {
    keywords: ['summary', 'summarize'],
    response: "Here is a brief summary of the uploaded document:\n\n- **Core Theme**: High-availability web servers.\n- **Key Takeaways**:\n  1. Decoupled databases with Redis cache-aside caching.\n  2. Message queue asynchronous writing protocols (RabbitMQ).\n  3. Load balancing policies using Nginx Round-Robin configuration."
  },
  {
    keywords: ['questions', 'interview'],
    response: "Based on the text, here are two highly relevant interview questions:\n\n1. *How would you solve the 'Thundering Herd' problem if a high-traffic cache key expires?*\n2. *What load balancing algorithm would you choose for persistent web socket connections, and why?*"
  },
  {
    keywords: ['revision', 'notes'],
    response: "Here are structured Revision Notes based on the uploaded document:\n\n1. **Web Server Decoupling**: Offload slow database operations into RabbitMQ async workers to prevent database connection pool exhaustion.\n2. **Redis Cache-Aside Strategy**: Read first from Redis; if a cache miss occurs, fetch from Postgres and populate Redis with a TTL of 3600s.\n3. **Load Balancer Routing**: Configure Nginx upstream servers to handle stateful sessions via client IP hashing."
  },
  {
    keywords: ['concept', 'explain'],
    response: "Here is an explanation of the core technical concepts inside your document:\n\n- **Redis Cache-Aside**: A pattern where the application reads from the cache first. If the data is not present (cache miss), it queries the database and writes it back to the cache for subsequent requests.\n- **Message Broker (RabbitMQ)**: A queue that decouples synchronous web requests from slow database writes, ensuring higher request throughput.\n- **Round-Robin Load Balancing**: Evenly distributes incoming client requests across a pool of backend application servers."
  },
  {
    keywords: ['cheat', 'sheet'],
    response: "Here is a customized Cheat Sheet block for the active document:\n\n- **Database Caching Protocol**:\n  ```javascript\n  const cached = await redis.get(key);\n  if (!cached) {\n    const data = await db.query(sql);\n    await redis.setex(key, 3600, JSON.stringify(data));\n  }\n  ```\n- **Nginx Stateful Routing upstream block**:\n  ```nginx\n  upstream backend {\n    ip_hash;\n    server app1.example.com;\n    server app2.example.com;\n  }\n  ```"
  },
  {
    keywords: ['topic', 'extract'],
    response: "Here are the key topics extracted from the document:\n\n1. **High-Traffic Web Architecture Topology**\n2. **Database Cache-Aside Patterns & Read Latency Reduction**\n3. **Asynchronous Write Buffering via RabbitMQ Message Queues**\n4. **Nginx Upstream Load Balancing Strategies (Round-Robin & Stateful IP Hashing)**"
  }
];

export const fileService = {
  upload: async (file, onProgress) => {
    // Simulate upload progress in stages
    let progress = 0;
    while (progress < 100) {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress > 100) progress = 100;
      onProgress(progress);
      await delay(400);
    }
    
    return {
      id: 'file_' + Date.now(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'Ready',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  },

  getChatResponse: async (filename, userMessage) => {
    await delay(1200); // Simulate AI typing latency
    
    const query = userMessage.toLowerCase();
    const match = mockChatResponses.find(r => 
      r.keywords.some(k => query.includes(k))
    );

    if (match) {
      return match.response;
    }

    return `I've analyzed your question: "${userMessage}" against your file **${filename}**. The document covers modern web architecture, caching strategies, and system design patterns. Based on this topic, I recommend looking at load balancing configurations, Redis cache-aside pipelines, or asynchronous task workers. Let me know if you would like a detailed explanation of any of these areas!`;
  }
};
