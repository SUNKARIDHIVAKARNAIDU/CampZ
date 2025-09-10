const FormInput = ({ label, name, type, register, error }) => (
<div className="mb-4">
<label className="block text-sm font-medium text-gray-700" htmlFor={name}>
{label}
</label>
<input
type={type}
id={name}
{...register(name)}
className={`mt-1 p-2 w-full border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
aria-invalid={error ? 'true' : 'false'}
/>
{error && <p className="text-red-500 text-sm">{error}</p>}
</div>
);

export default FormInput;