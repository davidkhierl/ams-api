import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsNumeric(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsNumeric',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must contain at least one numeric character`,
        ...validationOptions,
      },
      validator: {
        validate(value: any): Promise<boolean> | boolean {
          const containsNumeric = /(?=.*?[0-9])/;

          return containsNumeric.test(value);
        },
      },
    });
  };
}
