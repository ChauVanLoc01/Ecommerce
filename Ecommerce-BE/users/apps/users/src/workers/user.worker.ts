import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('authentication')
export class AudioConsumer {
  @Process('send-code')
  async sendCode(job: Job<unknown>) {
    return {}
  }

  @Process('send-mail')
  async sendMail(job: Job<unknown>) {
    return {}
  }
}
