import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

export function GreaterThanDate(
  property: string,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: new GreaterThanConstraint(property)
    })
  }
}

@ValidatorConstraint({ name: 'GreaterThanDate' })
export class GreaterThanConstraint implements ValidatorConstraintInterface {
  private readonly property: string
  constructor(prop: string) {
    this.property = prop
  }
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]
    if (!relatedValue) {
      return true
    }
    return new Date(value) > new Date(relatedValue)
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    const [relatedPropertyName] = validationArguments.constraints
    const property = validationArguments.property
    return `${property} must is greater than ${relatedPropertyName}`
  }
}
