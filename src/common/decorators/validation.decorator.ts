import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { FILE_SIZE } from '../constants/app.constants';

export function IsValidImageFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Express.Multer.File, args: ValidationArguments) {
          if (!value) return false;
          
          const isValidType = FILE_SIZE.ALLOWED_TYPES.includes(value.mimetype);
          const isValidSize = value.size <= FILE_SIZE.MAX_SIZE;
          
          return isValidType && isValidSize;
        },
        defaultMessage(args: ValidationArguments) {
          return `File must be a valid image (${FILE_SIZE.ALLOWED_TYPES.join(', ')}) and less than ${FILE_SIZE.MAX_SIZE / (1024 * 1024)}MB`;
        }
      }
    });
  };
}

export function IsGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value > relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must be greater than ${relatedPropertyName}`;
        }
      }
    });
  };
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const date = new Date(value);
          return date instanceof Date && !isNaN(date.getTime());
        },
        defaultMessage() {
          return `${propertyName} must be a valid date`;
        }
      }
    });
  };
} 