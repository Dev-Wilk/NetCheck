import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Network from 'expo-network'

import { useNetwork } from './hooks/useNetwork'
import { NetworkCard } from './components/NetworkCard'
import { CheckboxFilter } from './components/CheckboxFilter'
import { StatusBadge } from './components/StatusBadge'

// ─── Mapeamento do NetworkStateType para texto legível ────────────────────────
const CONNECTION_TYPE_LABEL = {
  [Network.NetworkStateType.WIFI]: 'Wi-Fi',
  [Network.NetworkStateType.CELLULAR]: 'Dados móveis (Cellular)',
  [Network.NetworkStateType.ETHERNET]: 'Ethernet',
  [Network.NetworkStateType.BLUETOOTH]: 'Bluetooth',
  [Network.NetworkStateType.WIMAX]: 'WiMAX',
  [Network.NetworkStateType.VPN]: 'VPN',
  [Network.NetworkStateType.OTHER]: 'Outro',
  [Network.NetworkStateType.NONE]: 'Sem conexão',
  [Network.NetworkStateType.UNKNOWN]: 'Desconhecido',
}

const CONNECTION_TYPE_ICON = {
  [Network.NetworkStateType.WIFI]: '📶',
  [Network.NetworkStateType.CELLULAR]: '📡',
  [Network.NetworkStateType.ETHERNET]: '🔌',
  [Network.NetworkStateType.BLUETOOTH]: '🔵',
  [Network.NetworkStateType.WIMAX]: '🗼',
  [Network.NetworkStateType.VPN]: '🔒',
  [Network.NetworkStateType.OTHER]: '🌐',
  [Network.NetworkStateType.NONE]: '❌',
  [Network.NetworkStateType.UNKNOWN]: '❓',
}

export default function App() {
  // ─── Estado dos filtros (checkboxes) ─────────────────────────────────────
  const [filters, setFilters] = useState({
    showConnectionType: true,  // Tipo de conexão (Wi-Fi, cellular…)
    showIpAddress: true,       // Endereço IP
    showAirplaneMode: true,    // Modo avião (Android only)
    showReachability: true,    // Internet alcançável
  })

  const { networkState, ipAddress, isAirplaneMode, airplaneSupported, loading, lastChange, refresh } =
    useNetwork()

  const toggleFilter = (key) =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))

  // ─── Valores derivados ────────────────────────────────────────────────────
  const connType = networkState?.type
  const connLabel = connType != null ? (CONNECTION_TYPE_LABEL[connType] ?? 'Desconhecido') : null
  const connIcon = connType != null ? (CONNECTION_TYPE_ICON[connType] ?? '🌐') : '❓'

  const reachabilityLabel = networkState
    ? networkState.isInternetReachable
      ? 'Internet acessível'
      : 'Sem acesso à internet'
    : null

  const reachabilityColor = networkState?.isInternetReachable ? '#4ade80' : '#f87171'

  const airplaneModeLabel = isAirplaneMode === null ? '—' : isAirplaneMode ? 'Ativo' : 'Desativado'
  const airplaneModeColor = isAirplaneMode ? '#f87171' : '#4ade80'

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Seção 1: Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>NetCheck</Text>
          <Text style={styles.appSubtitle}>Monitor de conexão em tempo real</Text>

          <View style={styles.badgeRow}>
            <StatusBadge networkState={networkState} />
          </View>

          {lastChange && (
            <Text style={styles.lastChange}>
              Última mudança detectada: {lastChange}
            </Text>
          )}
        </View>

        {/* ── Seção 2: Filtros (Checkboxes) ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exibir informações:</Text>

          <CheckboxFilter
            label="Tipo de conexão"
            value={filters.showConnectionType}
            onValueChange={() => toggleFilter('showConnectionType')}
            color="#4CAF50"
          />
          <CheckboxFilter
            label="Endereço IP"
            value={filters.showIpAddress}
            onValueChange={() => toggleFilter('showIpAddress')}
            color="#2196F3"
          />
          {/*
           * A prop `disabled` do expo-checkbox funciona em Android, iOS e Web.
           * Usamos disabled={Platform.OS !== 'android'} no filtro de modo avião
           * pois isAirplaneModeEnabledAsync() só existe no Android.
           * Exibir o card sem dados reais seria enganoso, então bloqueamos
           * a opção na plataforma incompatível.
           */}
          <CheckboxFilter
            label="Modo avião"
            value={filters.showAirplaneMode}
            onValueChange={() => toggleFilter('showAirplaneMode')}
            color="#FF9800"
            disabled={Platform.OS !== 'android'}
          />
          <CheckboxFilter
            label="Alcançabilidade da internet"
            value={filters.showReachability}
            onValueChange={() => toggleFilter('showReachability')}
            color="#9C27B0"
          />
        </View>

        {/* ── Seção 3: Cards de dados ───────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de rede:</Text>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#3b82f6" />
              <Text style={styles.loadingText}>Consultando rede…</Text>
            </View>
          )}

          {/* Card — Tipo de conexão (renderizado apenas se checkbox marcado) */}
          {!loading && filters.showConnectionType && (
            <NetworkCard
              icon={connIcon}
              label="Tipo de conexão"
              value={connLabel}
              accentColor="#4CAF50"
            />
          )}

          {/* Card — Endereço IP */}
          {!loading && filters.showIpAddress && (
            <NetworkCard
              icon="🔢"
              label="Endereço IP"
              value={ipAddress}
              accentColor="#2196F3"
            />
          )}

          {/* Card — Modo avião (Android only) */}
          {!loading && filters.showAirplaneMode && airplaneSupported && (
            <NetworkCard
              icon="✈️"
              label="Modo avião"
              value={airplaneModeLabel}
              accentColor="#FF9800"
              valueColor={airplaneModeColor}
            />
          )}

          {/* Card — Alcançabilidade */}
          {!loading && filters.showReachability && (
            <NetworkCard
              icon="🌍"
              label="Alcançabilidade"
              value={reachabilityLabel}
              accentColor="#9C27B0"
              valueColor={reachabilityColor}
            />
          )}

          {/* Mensagem quando todos os filtros estão desmarcados */}
          {!loading &&
            !filters.showConnectionType &&
            !filters.showIpAddress &&
            !(filters.showAirplaneMode && airplaneSupported) &&
            !filters.showReachability && (
              <Text style={styles.emptyMsg}>
                Nenhum painel selecionado. Marque ao menos um filtro acima.
              </Text>
            )}
        </View>

        {/* ── Seção 4: Botão de atualizar ───────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.refreshBtn, loading && styles.refreshBtnDisabled]}
          onPress={refresh}
          disabled={loading}
          activeOpacity={0.75}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.refreshBtnText}>↻  Atualizar</Text>
          )}
        </TouchableOpacity>

        {/* ── Rodapé informativo ────────────────────────────────────────────── */}
        <Text style={styles.footer}>
          Plataforma: {Platform.OS.toUpperCase()}
          {Platform.OS !== 'android' ? '  •  Modo avião indisponível' : ''}
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
    // Na web, flex:1 sozinho não preenche a viewport sem altura definida
    ...(Platform.OS === 'web' && { minHeight: '100vh' }),
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 12,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 16,
  },
  badgeRow: {
    marginBottom: 10,
  },
  lastChange: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },

  // Seções
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Sombra
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Loading
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 14,
  },

  // Mensagem vazia
  emptyMsg: {
    color: '#475569',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },

  // Botão
  refreshBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  refreshBtnDisabled: {
    backgroundColor: '#1d4ed8',
    opacity: 0.7,
  },
  refreshBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Rodapé
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#334155',
  },
})
