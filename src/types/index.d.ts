declare module 'swagger-ui-react' {
  interface Request {
    [k: string]: unknown;
  }
  interface Response {
    [k: string]: unknown;
  }
  type System = unknown;

  export type PluginGenerator = (system: System) => object;

  export type Plugin = object | PluginGenerator;

  export type Preset = () => unknown;

  export interface SwaggerUIProps {
    spec?: object | string;
    url?: string;
    layout?: string;
    onComplete?: null | ((system: System) => void);
    requestInterceptor?: (req: Request) => Request | Promise<Request>;
    responseInterceptor?: (res: Response) => Response | Promise<Response>;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelExpandDepth?: number;
    defaultModelsExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    initialState?: object;
    queryConfigEnabled?: boolean;
    plugins?: Plugin[];
    supportedSubmitMethods?: Array<
      'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'
    >;
    deepLinking?: boolean;
    showMutatedRequest?: boolean;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    presets?: Preset[];
    filter?: string | boolean;
    requestSnippetsEnabled?: boolean;
    requestSnippets?: object;
    displayOperationId?: boolean;
    tryItOutEnabled?: boolean;
    displayRequestDuration?: boolean;
    persistAuthorization?: boolean;
    withCredentials?: boolean;
    oauth2RedirectUrl?: string;
  }

  class SwaggerUI extends React.Component<SwaggerUIProps> {
    static config: {
      defaults: SwaggerUIProps & {
        plugins: [];
      };
    };

    static presets: unknown;
  }

  export default SwaggerUI;
}
