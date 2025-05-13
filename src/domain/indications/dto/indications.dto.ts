import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateIndicationDTO {
  @IsString()
  @IsNotEmpty()
  indication: string;

  @IsNotEmpty()
  @IsString()
  drugName: string;

  @IsArray()
  @ArrayNotEmpty()
  icd10Codes: string[];
}

class DrugDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  drugName: string;
}

class ICD10CodeDTO {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  icd10: string;
}

export class UpdateIndicationDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  drug?: DrugDTO;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  icd10Codes?: ICD10CodeDTO[];
}

export class QueryIndicationsDTO {
  @IsOptional()
  @IsUUID()
  indicationId?: string;

  @IsOptional()
  @IsUUID()
  drugId?: string;

  @IsOptional()
  @IsString()
  icd10code?: string;
}

