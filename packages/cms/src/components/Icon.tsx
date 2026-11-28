import logo from '@/assets/medrevue-logo.png';

// Shown in the admin navigation in place of the Payload icon.
export default function Icon() {
  return (
    <img
      alt="MedRevue"
      height={30}
      src={logo.src}
      style={{ borderRadius: 6 }}
      width={29}
    />
  );
}
