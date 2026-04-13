import { useEffect, useState, useCallback } from 'react'
import { Platform } from 'react-native'
import * as Network from 'expo-network'

export function useNetwork() {
  const [networkState, setNetworkState] = useState(null)
  const [ipAddress, setIpAddress] = useState(null)
  const [isAirplaneMode, setIsAirplaneMode] = useState(null)
  const [airplaneSupported, setAirplaneSupported] = useState(true)
  const [loading, setLoading] = useState(true)
  const [lastChange, setLastChange] = useState(null)

  const fetchNetworkInfo = useCallback(async () => {
    setLoading(true)
    try {
      // ─── Método 1: getNetworkStateAsync() ────────────────────────────────
      // Retorna { type, isConnected, isInternetReachable }
      // NetworkStateType: NONE | UNKNOWN | CELLULAR | WIFI | BLUETOOTH |
      //                   ETHERNET | WIMAX | VPN | OTHER
      // Disponível: Android, iOS, Web
      const state = await Network.getNetworkStateAsync()
      setNetworkState(state)

      // ─── Método 2: getIpAddressAsync() ───────────────────────────────────
      // Retorna o IP IPv4 do dispositivo como string.
      // Retorna "0.0.0.0" se não conseguir obter o endereço.
      // Disponível: Android, iOS, Web
      const ip = await Network.getIpAddressAsync()
      setIpAddress(ip)

      // ─── Método 3: isAirplaneModeEnabledAsync() ──────────────────────────
      // ATENÇÃO: disponível APENAS no Android.
      // No iOS este método não existe — lançará TypeError se chamado.
      // Referência: https://docs.expo.dev/versions/v55.0.0/sdk/network/
      if (Platform.OS === 'android') {
        const airplaneMode = await Network.isAirplaneModeEnabledAsync()
        setIsAirplaneMode(airplaneMode)
        setAirplaneSupported(true)
      } else {
        // iOS e Web: marcamos como não suportado em vez de lançar erro
        setAirplaneSupported(false)
        setIsAirplaneMode(null)
      }
    } catch (error) {
      console.error('Erro ao buscar informações de rede:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNetworkInfo()

    // ─── Método 4 (bônus): addNetworkStateListener() ─────────────────────
    // Adiciona listener que dispara automaticamente quando o estado de
    // rede muda (ex: Wi-Fi desconecta, dados móveis ativam, etc.).
    // Retorna um objeto de subscription com método .remove().
    // O cleanup (subscription.remove()) é obrigatório para evitar
    // memory leaks quando o componente é desmontado.
    // addNetworkStateListener pode não funcionar em todos os ambientes web.
    // O try/catch garante que a tela não quebre caso a API não esteja disponível.
    let subscription = null
    try {
      subscription = Network.addNetworkStateListener((state) => {
        setNetworkState(state)
        setLastChange(new Date().toLocaleTimeString('pt-BR'))
      })
    } catch (error) {
      console.warn('addNetworkStateListener não disponível nesta plataforma:', error)
    }

    // Cleanup: remove o listener quando o componente desmonta
    return () => subscription?.remove()
  }, [fetchNetworkInfo])

  return {
    networkState,
    ipAddress,
    isAirplaneMode,
    airplaneSupported,
    loading,
    lastChange,
    refresh: fetchNetworkInfo,
  }
}
