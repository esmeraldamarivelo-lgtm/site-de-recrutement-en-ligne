export default function Footer() {
  return (
    <footer style={{
      background: '#fff', borderTop: '1px solid var(--gray-border)',
      padding: '16px 24px', textAlign: 'center',
      fontSize: 12, color: 'var(--text-muted)'
    }}>
      © {new Date().getFullYear()} TalentConnect Madagascar — Tous droits réservés
    </footer>
  );
}
