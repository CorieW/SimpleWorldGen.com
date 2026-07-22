export default function enumOptions(values: Record<string, string>) {
    return Object.values(values).map((value) => ({ value, label: value }));
}
