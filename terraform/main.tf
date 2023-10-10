terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "default" {
  allocated_storage   = 10
  db_name             = "study"
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t3.micro"
  username            = "postgres"
  password            = "9ad3fa01-de19-4a7c-ac71-a3eb8271c056"
  publicly_accessible = true
  skip_final_snapshot = true
}
