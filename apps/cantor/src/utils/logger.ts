import { Logger as PinoLogger } from "pino";

const environment = process.env.IS_LOCAL
  ? "local"
  : (process.env.NODE_ENV as string);

type LoggerProps = {
  service: string;
  functionName: string;
};

type LogArgs = {
  service: string;
  functionName: string;
  environment: string;
};

export class Logger {
  public service: string;
  public functionName: string;

  constructor(private pino: PinoLogger, props: LoggerProps) {
    this.service = props.service;
    this.functionName = props.functionName;
  }

  private constructArgs(): LogArgs {
    return {
      service: this.service,
      functionName: this.functionName,
      environment
    };
  }

  public debug(msg: string): void {
    this.pino.debug(this.constructArgs(), msg);
  }

  public info(msg: string): void {
    this.pino.info(this.constructArgs(), msg);
  }

  public warn(msg: string): void {
    this.pino.warn(this.constructArgs(), msg);
  }

  public error(err: unknown): void {
    this.pino.error({
      ...this.constructArgs(),
      err
    });
  }
}
