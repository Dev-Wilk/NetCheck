import { View, Text, StyleSheet } from 'react-native'

// Badge visual que muda cor e texto conforme o estado da conexão:
//   • Conectado + internet acessível → verde  / "Online"
//   • Conectado mas sem internet     → laranja / "Conectado (sem internet)"
//   • Desconectado                   → vermelho/ "Offline"
export function StatusBadge({ networkState }) {
  const getStatus = () => {
    if (!networkState) return { label: 'Verificando...', color: '#64748b' }

    if (networkState.isConnected && networkState.isInternetReachable) {
      return { label: 'Online', color: '#16a34a' }
    }
    if (networkState.isConnected && !networkState.isInternetReachable) {
      return { label: 'Conectado (sem internet)', color: '#ea580c' }
    }
    return { label: 'Offline', color: '#dc2626' }
  }

  const { label, color } = getStatus()

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <View style={styles.dot} />
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  text: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
