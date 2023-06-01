import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsSpecialChar(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsSpecialChar',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must contain at least one special character`,
        ...validationOptions,
      },
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          const containsSpecialChar = /(?=.*?[#?!@$%^&*-])/;

          return containsSpecialChar.test(value);
        },
      },
    });
  };
}
