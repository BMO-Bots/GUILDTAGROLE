import { ErrorEventData } from '../types';

export const errorEvent = {
  name: 'error' as const,
  execute: (error: Error): void => {
    const errorData: ErrorEventData = {
      error,
      source: 'client'
    };

    console.error('❌ Discord client error:');
    console.error(`📍 Source: ${errorData.source}`);
    console.error(`💬 Message: ${errorData.error.message}`);
    console.error(`📚 Stack: ${errorData.error.stack}`);
  }
};

export const setupProcessErrorHandlers = (): void => {
  process.on('unhandledRejection', (error: Error) => {
    const errorData: ErrorEventData = {
      error,
      source: 'unhandledRejection'
    };

    console.error('❌ Unhandled Promise Rejection:');
    console.error(`📍 Source: ${errorData.source}`);
    console.error(`💬 Message: ${errorData.error.message}`);
    console.error(`📚 Stack: ${errorData.error.stack}`);
  });

  process.on('uncaughtException', (error: Error) => {
    const errorData: ErrorEventData = {
      error,
      source: 'process'
    };

    console.error('❌ Uncaught Exception:');
    console.error(`📍 Source: ${errorData.source}`);
    console.error(`💬 Message: ${errorData.error.message}`);
    console.error(`📚 Stack: ${errorData.error.stack}`);
    process.exit(1);
  });
}; 