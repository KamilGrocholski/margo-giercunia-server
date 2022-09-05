declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string;
        NODE_ENV: 'development' | 'production';
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        PORT?: string;
        PWD: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}