// klaro.d.ts
declare module 'klaro' {
    const klaro: {
      setup(config: any): void;
      show(): void;
      getManager(): {
        consents: Record<string, boolean>;
      };
    };
    export default klaro;
  }