import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { Cache } from 'cache-manager';
import { Queue } from 'common/constants/queue.constant';

export type EmailInfor = {
  to: string;
  subject: string;
  html: string;
};

export type ForgotPasswordType = {
  email: string;
  code: string;
  user_id: string;
  password: string;
  email_infor: EmailInfor;
};

@Processor(Queue.sendMail)
export class MailConsummer {
  constructor(
    private readonly mailService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Process(Queue.register)
  async register(job: Job<EmailInfor>) {
    await this.mailService.sendMail(job.data);
  }

  @Process(Queue.forgetPassword)
  async forgotPassword(job: Job<ForgotPasswordType>) {
    const { code, email, email_infor, user_id, password } = job.data;
    const data = JSON.stringify({
      user_id,
      password,
    });
    try {
      await this.mailService.sendMail(email_infor);
      await Promise.all([
        // @ts-ignore
        this.cacheManager.set(email, code, {
          ttl: 20,
        }),
        this.cacheManager.set(
          code,
          data,
          // @ts-ignore
          { ttl: 30 },
        ),
      ]);
    } catch (err) {
      await Promise.all([
        this.cacheManager.del(email),
        this.cacheManager.del(code),
      ]);
    }
  }
}
