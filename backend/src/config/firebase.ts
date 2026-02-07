import 'dotenv/config';
import admin from 'firebase-admin';

// Initialize Firebase Admin (with demo mode fallback)
const isDemo = process.env.NODE_ENV === 'development' && 
              (!process.env.FIREBASE_PROJECT_ID || 
               process.env.FIREBASE_PROJECT_ID === 'demo-project');

let db: any;
let auth: any;

if (!isDemo) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }

  db = admin.firestore();
  auth = admin.auth();
} else {
  // Demo mode - mock Firestore with in-memory storage
  console.log('🚀 Running in DEMO MODE - Using in-memory database');
  
  const mockData: { [key: string]: { [key: string]: any } } = {};

  db = {
    collection: (collectionName: string) => ({
      doc: (docId: string) => ({
        get: async () => {
          const data = mockData[collectionName]?.[docId];
          return {
            exists: !!data,
            data: () => data || {},
            id: docId,
          };
        },
        set: async (data: any) => {
          if (!mockData[collectionName]) mockData[collectionName] = {};
          mockData[collectionName][docId] = { ...data, id: docId };
          return { id: docId };
        },
        update: async (data: any) => {
          if (mockData[collectionName]?.[docId]) {
            mockData[collectionName][docId] = {
              ...mockData[collectionName][docId],
              ...data,
            };
          }
          return {};
        },
        delete: async () => {
          if (mockData[collectionName]) {
            delete mockData[collectionName][docId];
          }
          return {};
        },
        collection: (subCollection: string) => ({
          doc: (subDocId: string) => ({
            get: async () => {
              const subKey = `${collectionName}/${docId}/${subCollection}/${subDocId}`;
              const data = mockData[subKey];
              return {
                exists: !!data,
                data: () => data || {},
                id: subDocId,
              };
            },
            set: async (data: any) => {
              const subKey = `${collectionName}/${docId}/${subCollection}/${subDocId}`;
              mockData[subKey] = { ...data, id: subDocId };
              return { id: subDocId };
            },
          }),
          get: async () => {
            const prefix = `${collectionName}/${docId}/${subCollection}/`;
            const docs = Object.entries(mockData)
              .filter(([key]) => key.startsWith(prefix))
              .map(([, data]) => ({
                id: (data as any).id,
                data: () => data,
              }));
            return { docs };
          },
        }),
      }),
      add: async (data: any) => {
        const id = Math.random().toString(36).substr(2, 9);
        if (!mockData[collectionName]) mockData[collectionName] = {};
        mockData[collectionName][id] = { ...data, id };
        return { id };
      },
      where: (field: string, operator: string, value: any) => {
        let limitValue = -1; // -1 means no limit
        return {
          limit: (n: number) => {
            limitValue = n;
            return {
              get: async () => {
                const filtered = Object.entries(mockData[collectionName] || {})
                  .filter(([, data]: any) => {
                    const docValue = data[field];
                    if (operator === '==') return docValue === value;
                    if (operator === '<') return docValue < value;
                    if (operator === '>') return docValue > value;
                    if (operator === '<=') return docValue <= value;
                    if (operator === '>=') return docValue >= value;
                    return true;
                  })
                  .map(([id, data]: any) => ({
                    id,
                    data: () => data,
                  }))
                  .slice(0, limitValue === -1 ? undefined : limitValue);
                return { docs: filtered };
              },
            };
          },
          get: async () => {
            const filtered = Object.entries(mockData[collectionName] || {})
              .filter(([, data]: any) => {
                const docValue = data[field];
                if (operator === '==') return docValue === value;
                if (operator === '<') return docValue < value;
                if (operator === '>') return docValue > value;
                if (operator === '<=') return docValue <= value;
                if (operator === '>=') return docValue >= value;
                return true;
              })
              .map(([id, data]: any) => ({
                id,
                data: () => data,
              }))
              .slice(0, limitValue === -1 ? undefined : limitValue);
            return { docs: filtered };
          },
        };
      },
      get: async () => {
        const docs = Object.entries(mockData[collectionName] || {}).map(
          ([id, data]) => ({
            id,
            data: () => data,
          })
        );
        return { docs };
      },
    }),
  };

  auth = {
    createUser: async (data: any) => ({ uid: 'demo-user', email: data.email }),
    getUser: async (uid: string) => ({ uid, email: 'demo@example.com' }),
    updateUser: async (uid: string, data: any) => ({}),
    deleteUser: async (uid: string) => ({}),
  };
}

export { db, auth };
export default admin;

