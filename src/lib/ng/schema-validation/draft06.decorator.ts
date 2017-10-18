export function draft06(target, propertyKey: string, descriptor: PropertyDescriptor): any {
	const oldValue = descriptor.value;

	descriptor.value = function() {
		let schema = JSON.parse(JSON.stringify(arguments[0]));	// deep clone
		convert(schema);
		oldValue.call(this, schema);
	};

	return descriptor;


	function convert(schema) {
		convertId(schema);
		schema.required = schema.required || [];

		if (schema.properties) {
			Object.keys(schema.properties).forEach((propertyName: string) => {
				let property = schema.properties[propertyName];
				arrayifyRequired(property, propertyName, schema);
				convertAnyIntoObject(property);
				if (property.items || property.properties) {
					convert(property.items || property);
				}
			});
		}
	}

	function convertId(schema) {
		if (schema.id) {
			schema.$id = schema.id;
			delete schema.id;
		}
	}

	function arrayifyRequired(property, propertyName, schema) {
		if (property.required && !property.required.length) {
			schema.required.push(propertyName);
			delete property.required;
		}
	}

	function convertAnyIntoObject(property) {
		if (property.type === 'any') {
			property.type = 'object';
		}
	}
}