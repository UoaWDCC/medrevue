import logo from '@/assets/medrevue-logo.png';

// Shown on the login screen in place of the Payload logo.
export default function Logo() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <img
        alt="MedRevue"
        height={120}
        src={logo.src}
        style={{ borderRadius: 16 }}
        width={116}
      />
      <span style={{ fontSize: 22, fontWeight: 600 }}>
        MedRevue Website Editor
      </span>
    </div>
  );
}
