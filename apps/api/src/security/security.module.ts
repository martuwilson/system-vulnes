import { Module } from '@nestjs/common';
import { SecurityResolver } from './security.resolver';
import { SecurityService } from './security.service';
import { EmailSecurityScanner } from './scanners/email-security.scanner';
import { SSLCertificateScanner } from './scanners/ssl-certificate.scanner';
import { SecurityHeadersScanner } from './scanners/security-headers.scanner';
import { PortScanner } from './scanners/port.scanner';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    SecurityResolver,
    SecurityService,
    EmailSecurityScanner,
    SSLCertificateScanner,
    SecurityHeadersScanner,
    PortScanner,
  ],
  exports: [SecurityService],
})
export class SecurityModule {}
