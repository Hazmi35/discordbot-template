export function defineModifier(val: PropertyModifier) {
    return function decorate(target: unknown, key: string, descriptor?: PropertyModifier): void {
        if (descriptor) {
            const keys = Object.keys(val) as (keyof PropertyModifier)[];
            for (const key of keys) descriptor[key] = val[key];
        } else {
            Object.defineProperty(target, key, {
                set(value): void {
                    Object.defineProperty(this, key, {
                        configurable: true,
                        enumerable: true,
                        value,
                        ...val,
                        writable: true
                    });
                }
            });
        }
    };
}

export function setEnumerable(enumerable: boolean): ReturnType<typeof defineModifier> {
    return defineModifier({ enumerable });
}

export function setWriteable(writable: boolean): ReturnType<typeof defineModifier> {
    return defineModifier({ writable });
}

export function setConfigurable(configurable: boolean): ReturnType<typeof defineModifier> {
    return defineModifier({ configurable });
}

export function hide(...args: Parameters<ReturnType<typeof defineModifier>>): void {
    return defineModifier({ enumerable: false })(...args);
}

export function visible(...args: Parameters<ReturnType<typeof defineModifier>>): void {
    return defineModifier({ enumerable: true })(...args);
}


export type PropertyModifier = PropertyDescriptor;
