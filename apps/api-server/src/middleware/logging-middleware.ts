import { type NestMiddleware, Injectable, Logger } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    // do nothing
  }

  use(
    request: FastifyRequest['raw'],
    response: FastifyReply['raw'],
    next: (error?: any) => void,
  ) {
    const startedAt = Date.now();

    const method = request.method;
    const url = request.url; // FIXME: fastapi's raw request has no URL
    const ip = request.socket.remoteAddress;

    // Logging request
    this.logger.debug(`${ip} -> ${method} ${url}`);

    // Logging response on finish event
    let finished = false;
    response.once('finish', () => {
      finished = true;
      const duration = Date.now() - startedAt;
      this.logger.log(
        `${ip} <- (${response.statusCode}) ${request.method} ${url}: ${duration}ms`,
      );
    });

    // Logging response on close event (when socket was disconnected before finish)
    response.once('close', () => {
      const duration = Date.now() - startedAt;
      if (!finished) {
        this.logger.warn(
          `${ip} <- (${response.statusCode}) ${request.method} ${url}: ${duration}ms (Disconnected)`,
        );
      }
    });

    next();
  }
}
