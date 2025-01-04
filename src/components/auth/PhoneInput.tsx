import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow digits and limit to 10 characters
    const cleaned = input.replace(/\D/g, '').slice(0, 10);
    onChange(cleaned);
  };

  const formatDisplay = (phone: string) => {
    if (!phone) return '';
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-purple-900">
        <Phone className="w-4 h-4 inline-block ml-2" />
        رقم الجوال
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <span className="text-purple-600">05</span>
        </div>
        <input
          type="tel"
          value={formatDisplay(value)}
          onChange={handleChange}
          className="form-input text-left pr-12"
          placeholder="5XXXXXXXX"
          dir="ltr"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}