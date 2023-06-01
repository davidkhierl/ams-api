import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsUpperLetter(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsUpperLetter',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must contain at least one upper case letter`,
        ...validationOptions,
      },
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          const containsUpperLetter = /(?=.*?[A-Z])/;

          return containsUpperLetter.test(value);
        },
      },
    });
  };
}
