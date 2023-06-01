import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsLowerLetter(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsLowerLetter',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must contain at least one lower case letter`,
        ...validationOptions,
      },
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          const containsLowerLetter = /(?=.*?[a-z])/;

          return containsLowerLetter.test(value);
        },
      },
    });
  };
}
