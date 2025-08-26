import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  domain: string;
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  domain?: string;
}

@InputType()
export class CreateAssetInput {
  @Field()
  @IsString()
  domain: string;

  @Field()
  @IsString()
  companyId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateTaskInput {
  @Field()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

@InputType()
export class InviteUserInput {
  @Field()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @Field()
  @IsString()
  companyId: string;

  @Field(() => String)
  role: string; // CompanyRole como string
}

@InputType()
export class UpdateCompanyUserInput {
  @Field()
  @IsString()
  companyUserId: string;

  @Field(() => String)
  role: string; // CompanyRole como string
}

@InputType()
export class NotificationSettingInput {
  @Field()
  @IsString()
  companyId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  emailAlerts?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slackWebhook?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  teamsWebhook?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  criticalOnly?: boolean;
}

@InputType()
export class CreateScheduledReportInput {
  @Field()
  @IsString()
  companyId: string;

  @Field(() => String)
  frequency: string; // ReportFrequency como string

  @Field(() => String)
  format: string; // ReportFormat como string

  @Field()
  @IsString()
  recipients: string; // JSON array como string
}
