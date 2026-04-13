import Checkbox from 'expo-checkbox'
import { View, Text, StyleSheet, Platform } from 'react-native'

// ─── Propriedades do expo-checkbox demonstradas (excluindo value e style) ───
//
// 1. onValueChange — callback disparado quando o estado do checkbox muda.
//    Recebe o novo valor booleano como argumento.
//
// 2. color — cor do checkbox quando marcado (checked).
//    Quando desmarcado, passamos undefined para usar a cor padrão do sistema.
//    Cores diferentes por filtro tornam a UI mais informativa.
//
// 3. disabled — desabilita visual e funcionalmente o checkbox.
//    Usado no filtro de "Modo Avião" quando a plataforma é iOS,
//    pois isAirplaneModeEnabledAsync() não está disponível no iOS.
//    A prop `disabled` funciona em Android, iOS e Web.
//    Referência: https://docs.expo.dev/versions/v55.0.0/sdk/checkbox/

export function CheckboxFilter({
  label,
  value,
  onValueChange,
  color,
  disabled = false,
}) {
  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <Checkbox
        // Propriedade 1: onValueChange
        onValueChange={onValueChange}
        // Propriedade 2: color — cor quando marcado; undefined quando desmarcado
        color={value ? color : undefined}
        // Propriedade 3: disabled — bloqueia interação e escurece visualmente
        disabled={disabled}
        value={value}
      />
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
        {disabled ? ' (indisponível nesta plataforma)' : ''}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 15,
    color: '#e2e8f0',
    flexShrink: 1,
  },
  labelDisabled: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
})
