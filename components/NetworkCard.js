import { View, Text, StyleSheet } from 'react-native'

// Card que exibe uma informação de rede com ícone textual, label e valor.
// A prop `accentColor` pinta a borda esquerda, diferenciando cada tipo de dado.
export function NetworkCard({ icon, label, value, accentColor = '#3b82f6', valueColor }) {
  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>
        {value ?? '—'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    // Sombra Android
    elevation: 3,
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 18,
    color: '#f1f5f9',
    fontWeight: '700',
  },
})
