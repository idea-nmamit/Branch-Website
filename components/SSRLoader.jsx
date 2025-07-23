// SSR-friendly loader for instant gradient background
export default function SSRLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(to bottom right, #17003A, #34006e)',
    }} />
  );
}
