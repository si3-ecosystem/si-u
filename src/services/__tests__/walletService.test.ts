import { WalletService, WalletType, NetworkType } from '../walletService'
import { apiClient } from '../api'

// Mock the API client
jest.mock('../api')

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('WalletService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWalletInfo', () => {
    it('fetches wallet information successfully', async () => {
      const mockResponse = {
        status: 'success' as const,
        data: {
          walletInfo: {
            address: '0x1234567890123456789012345678901234567890',
            connectedWallet: 'MetaMask' as WalletType,
            network: 'Mainnet' as NetworkType,
            connectedAt: '2024-08-10T10:00:00Z',
          },
          isConnected: true,
        },
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await WalletService.getWalletInfo()

      expect(mockApiClient.get).toHaveBeenCalledWith('/user/wallet/info')
      expect(result).toEqual(mockResponse)
    })

    it('handles API errors', async () => {
      const error = new Error('API Error')
      mockApiClient.get.mockRejectedValue(error)

      await expect(WalletService.getWalletInfo()).rejects.toThrow('API Error')
    })
  })

  describe('connectWallet', () => {
    const mockConnectRequest = {
      address: '0x1234567890123456789012345678901234567890',
      connectedWallet: 'MetaMask' as WalletType,
      network: 'Mainnet' as NetworkType,
    }

    it('connects wallet successfully', async () => {
      const mockResponse = {
        status: 'success' as const,
        data: {
          walletInfo: {
            ...mockConnectRequest,
            connectedAt: '2024-08-10T10:00:00Z',
          },
          message: 'Wallet connected successfully',
        },
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await WalletService.connectWallet(mockConnectRequest)

      expect(mockApiClient.post).toHaveBeenCalledWith('/user/wallet/connect', mockConnectRequest)
      expect(result).toEqual(mockResponse)
    })

    it('handles connect errors', async () => {
      const error = new Error('Connect failed')
      mockApiClient.post.mockRejectedValue(error)

      await expect(WalletService.connectWallet(mockConnectRequest)).rejects.toThrow('Connect failed')
    })
  })

  describe('disconnectWallet', () => {
    it('disconnects wallet successfully', async () => {
      const mockResponse = {
        status: 'success' as const,
      }

      mockApiClient.delete.mockResolvedValue(mockResponse)

      const result = await WalletService.disconnectWallet()

      expect(mockApiClient.delete).toHaveBeenCalledWith('/user/wallet/disconnect')
      expect(result).toEqual(mockResponse)
    })

    it('handles disconnect errors', async () => {
      const error = new Error('Disconnect failed')
      mockApiClient.delete.mockRejectedValue(error)

      await expect(WalletService.disconnectWallet()).rejects.toThrow('Disconnect failed')
    })
  })

  describe('Utility Functions', () => {
    describe('isValidEthereumAddress', () => {
      it('validates correct Ethereum addresses', () => {
        const validAddresses = [
          '0x1234567890123456789012345678901234567890',
          '0xabcdefABCDEF1234567890123456789012345678',
          '0x0000000000000000000000000000000000000000',
        ]

        validAddresses.forEach(address => {
          expect(WalletService.isValidEthereumAddress(address)).toBe(true)
        })
      })

      it('rejects invalid Ethereum addresses', () => {
        const invalidAddresses = [
          '1234567890123456789012345678901234567890', // Missing 0x
          '0x123456789012345678901234567890123456789', // Too short
          '0x12345678901234567890123456789012345678901', // Too long
          '0xGHIJKL7890123456789012345678901234567890', // Invalid characters
          '', // Empty string
          '0x', // Just prefix
        ]

        invalidAddresses.forEach(address => {
          expect(WalletService.isValidEthereumAddress(address)).toBe(false)
        })
      })
    })

    describe('formatWalletAddress', () => {
      it('formats wallet address correctly with default parameters', () => {
        const address = '0x1234567890123456789012345678901234567890'
        const formatted = WalletService.formatWalletAddress(address)
        
        expect(formatted).toBe('0x1234...7890')
      })

      it('formats wallet address with custom parameters', () => {
        const address = '0x1234567890123456789012345678901234567890'
        const formatted = WalletService.formatWalletAddress(address, 8, 6)
        
        expect(formatted).toBe('0x123456...567890')
      })

      it('returns original address if too short', () => {
        const shortAddress = '0x1234'
        const formatted = WalletService.formatWalletAddress(shortAddress)
        
        expect(formatted).toBe(shortAddress)
      })

      it('handles empty address', () => {
        const formatted = WalletService.formatWalletAddress('')
        
        expect(formatted).toBe('')
      })
    })

    describe('getWalletDisplayName', () => {
      it('returns correct display names for supported wallets', () => {
        expect(WalletService.getWalletDisplayName('MetaMask')).toBe('MetaMask')
        expect(WalletService.getWalletDisplayName('Zerion')).toBe('Zerion')
        expect(WalletService.getWalletDisplayName('WalletConnect')).toBe('WalletConnect')
        expect(WalletService.getWalletDisplayName('Other')).toBe('Other Wallet')
      })
    })

    describe('getNetworkInfo', () => {
      it('returns correct network information', () => {
        const mainnetInfo = WalletService.getNetworkInfo('Mainnet')
        expect(mainnetInfo.name).toBe('Ethereum Mainnet')
        expect(mainnetInfo.chainId).toBe(1)

        const polygonInfo = WalletService.getNetworkInfo('Polygon')
        expect(polygonInfo.name).toBe('Polygon')
        expect(polygonInfo.chainId).toBe(137)
      })
    })

    describe('isWalletConnected', () => {
      it('returns true when wallet has address', () => {
        const walletInfo = {
          address: '0x1234567890123456789012345678901234567890',
          connectedWallet: 'MetaMask' as WalletType,
          network: 'Mainnet' as NetworkType,
        }

        expect(WalletService.isWalletConnected(walletInfo)).toBe(true)
      })

      it('returns false when wallet has no address', () => {
        const walletInfo = {
          connectedWallet: 'MetaMask' as WalletType,
          network: 'Mainnet' as NetworkType,
        }

        expect(WalletService.isWalletConnected(walletInfo)).toBe(false)
      })

      it('returns false when walletInfo is null', () => {
        expect(WalletService.isWalletConnected(null)).toBe(false)
      })
    })

    describe('validateConnectRequest', () => {
      it('validates correct connect request', () => {
        const validRequest = {
          address: '0x1234567890123456789012345678901234567890',
          connectedWallet: 'MetaMask' as WalletType,
          network: 'Mainnet' as NetworkType,
        }

        const result = WalletService.validateConnectRequest(validRequest)
        
        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it('validates invalid connect request', () => {
        const invalidRequest = {
          address: 'invalid-address',
          connectedWallet: 'UnsupportedWallet' as any,
          network: 'UnsupportedNetwork' as any,
        }

        const result = WalletService.validateConnectRequest(invalidRequest)
        
        expect(result.valid).toBe(false)
        expect(result.errors).toContain('Invalid Ethereum address format')
        expect(result.errors).toContain('Unsupported wallet type')
        expect(result.errors).toContain('Unsupported network')
      })

      it('validates missing fields', () => {
        const incompleteRequest = {
          address: '',
          connectedWallet: undefined as any,
          network: undefined as any,
        }

        const result = WalletService.validateConnectRequest(incompleteRequest)
        
        expect(result.valid).toBe(false)
        expect(result.errors).toContain('Wallet address is required')
        expect(result.errors).toContain('Wallet type is required')
        expect(result.errors).toContain('Network is required')
      })
    })

    describe('getConnectionStatusText', () => {
      it('returns connected status for wallet with address', () => {
        const walletInfo = {
          address: '0x1234567890123456789012345678901234567890',
          connectedWallet: 'MetaMask' as WalletType,
          network: 'Mainnet' as NetworkType,
        }

        const status = WalletService.getConnectionStatusText(walletInfo)
        expect(status).toBe('Connected to MetaMask')
      })

      it('returns no wallet status for null wallet', () => {
        const status = WalletService.getConnectionStatusText(null)
        expect(status).toBe('No wallet connected')
      })

      it('returns no wallet status for wallet without address', () => {
        const walletInfo = {
          connectedWallet: 'MetaMask' as WalletType,
          network: 'Mainnet' as NetworkType,
        }

        const status = WalletService.getConnectionStatusText(walletInfo)
        expect(status).toBe('No wallet connected')
      })
    })

    describe('getTimeSinceActivity', () => {
      it('returns correct time format for recent activity', () => {
        const recentTime = new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        const result = WalletService.getTimeSinceActivity(recentTime)
        expect(result).toBe('Recently')
      })

      it('returns correct time format for hours ago', () => {
        const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
        const result = WalletService.getTimeSinceActivity(hoursAgo)
        expect(result).toBe('3 hours ago')
      })

      it('returns correct time format for days ago', () => {
        const daysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        const result = WalletService.getTimeSinceActivity(daysAgo)
        expect(result).toBe('2 days ago')
      })
    })
  })
})
