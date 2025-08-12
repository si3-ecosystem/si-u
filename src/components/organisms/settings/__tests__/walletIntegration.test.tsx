import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import Settings from '../index'
import { WalletService } from '@/services/walletService'
import { toast } from 'sonner'

// Mock the services and components
jest.mock('@/services/walletService')
jest.mock('sonner')
jest.mock('@/components/organisms/auth/login/wallet/WalletDialog', () => ({
  WalletDialog: ({ open, onOpenChange, onWalletConnected }: any) => (
    open ? (
      <div data-testid="wallet-dialog">
        <button 
          onClick={() => onWalletConnected('0x1234567890123456789012345678901234567890', 'MetaMask')}
          data-testid="connect-metamask"
        >
          Connect MetaMask
        </button>
        <button 
          onClick={() => onWalletConnected('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'Zerion')}
          data-testid="connect-zerion"
        >
          Connect Zerion
        </button>
        <button onClick={() => onOpenChange(false)} data-testid="close-dialog">
          Close
        </button>
      </div>
    ) : null
  )
}))

const mockWalletService = WalletService as jest.Mocked<typeof WalletService>
const mockToast = toast as jest.Mocked<typeof toast>

describe('Wallet Integration Tests', () => {
  const mockWalletInfo = {
    address: '0x1234567890123456789012345678901234567890',
    connectedWallet: 'MetaMask' as const,
    network: 'Mainnet' as const,
    connectedAt: '2024-08-10T10:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    mockWalletService.getWalletInfo.mockResolvedValue({
      status: 'success',
      data: {
        walletInfo: null,
        isConnected: false,
      },
    })
    
    mockWalletService.disconnectWallet.mockResolvedValue({
      status: 'success',
    })
    
    mockWalletService.connectWallet.mockResolvedValue({
      status: 'success',
      data: {
        walletInfo: mockWalletInfo,
        message: 'Wallet connected successfully',
      },
    })
    
    mockWalletService.formatWalletAddress.mockReturnValue('0x1234...7890')
    mockWalletService.getWalletDisplayName.mockReturnValue('MetaMask')
    mockWalletService.getNetworkInfo.mockReturnValue({
      name: 'Ethereum Mainnet',
      color: 'bg-brand/10 text-brand',
      chainId: 1,
    })
    mockWalletService.isWalletConnected.mockImplementation((walletInfo) => !!walletInfo?.address)
    
    mockToast.success = jest.fn()
    mockToast.error = jest.fn()
    mockToast.warning = jest.fn()
  })

  describe('Complete Wallet Flow', () => {
    it('allows user to connect wallet when none is connected', async () => {
      const user = userEvent.setup()
      
      const userWithoutWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: true,
        isEmailVerified: true,
      }

      render(<Settings />, {
        initialState: {
          user: { user: userWithoutWallet },
        },
      })

      // Should show connect wallet button
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
      expect(screen.getByText('No wallet connected')).toBeInTheDocument()

      // Click connect wallet
      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      // Wallet dialog should open
      expect(screen.getByTestId('wallet-dialog')).toBeInTheDocument()

      // Connect MetaMask
      const connectMetaMaskButton = screen.getByTestId('connect-metamask')
      await user.click(connectMetaMaskButton)

      // Should call wallet service
      await waitFor(() => {
        expect(mockWalletService.connectWallet).toHaveBeenCalledWith({
          address: '0x1234567890123456789012345678901234567890',
          connectedWallet: 'MetaMask',
          network: 'Mainnet',
        })
      })

      expect(mockToast.success).toHaveBeenCalledWith('Wallet connected successfully!')
    })

    it('allows verified user to disconnect and reconnect wallet', async () => {
      const user = userEvent.setup()
      
      const userWithWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: true,
        isEmailVerified: true,
        walletInfo: mockWalletInfo,
      }

      // Start with connected wallet
      mockWalletService.isWalletConnected.mockReturnValue(true)

      const { rerender } = render(<Settings />, {
        initialState: {
          user: { user: userWithWallet },
        },
      })

      // Should show disconnect wallet button
      expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument()
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()

      // Disconnect wallet
      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      await waitFor(() => {
        expect(mockWalletService.disconnectWallet).toHaveBeenCalled()
      })

      expect(mockToast.success).toHaveBeenCalledWith(
        'Wallet disconnected successfully. You can reconnect a wallet anytime.'
      )

      // Simulate state change after disconnect
      mockWalletService.isWalletConnected.mockReturnValue(false)
      
      rerender(<Settings />, {
        initialState: {
          user: { 
            user: { 
              ...userWithWallet, 
              walletInfo: undefined 
            } 
          },
        },
      })

      // Should now show connect wallet button
      await waitFor(() => {
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
      })

      // Reconnect wallet
      const reconnectButton = screen.getByText('Connect Wallet')
      await user.click(reconnectButton)

      // Should open wallet dialog again
      expect(screen.getByTestId('wallet-dialog')).toBeInTheDocument()

      // Connect different wallet (Zerion)
      const connectZerionButton = screen.getByTestId('connect-zerion')
      await user.click(connectZerionButton)

      await waitFor(() => {
        expect(mockWalletService.connectWallet).toHaveBeenCalledWith({
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          connectedWallet: 'Other', // Zerion maps to Other in the simplified logic
          network: 'Mainnet',
        })
      })
    })

    it('prevents unverified user from disconnecting wallet', async () => {
      const user = userEvent.setup()
      
      const unverifiedUserWithWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: false,
        isEmailVerified: false,
        walletInfo: mockWalletInfo,
      }

      mockWalletService.isWalletConnected.mockReturnValue(true)

      render(<Settings />, {
        initialState: {
          user: { user: unverifiedUserWithWallet },
        },
      })

      // Should show email verification warning
      expect(screen.getByText(/Please verify your email address/)).toBeInTheDocument()

      // Disconnect button should be disabled
      const disconnectButton = screen.getByText('Disconnect Wallet')
      expect(disconnectButton).toBeDisabled()

      // Try to click (should not work)
      await user.click(disconnectButton)

      // Should show error message
      expect(mockToast.error).toHaveBeenCalledWith(
        'Please verify your email address before disconnecting your wallet. This ensures you can still access your account.'
      )

      // Should not call disconnect service
      expect(mockWalletService.disconnectWallet).not.toHaveBeenCalled()
    })

    it('handles API failures gracefully during disconnect', async () => {
      const user = userEvent.setup()
      
      const userWithWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: true,
        isEmailVerified: true,
        walletInfo: mockWalletInfo,
      }

      mockWalletService.isWalletConnected.mockReturnValue(true)
      mockWalletService.disconnectWallet.mockRejectedValue(new Error('Server error'))

      render(<Settings />, {
        initialState: {
          user: { user: userWithWallet },
        },
      })

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      await waitFor(() => {
        expect(mockToast.warning).toHaveBeenCalledWith(
          'Wallet disconnected locally. Server sync failed.'
        )
      })

      // Should still disconnect locally for better UX
      expect(mockWalletService.disconnectWallet).toHaveBeenCalled()
    })

    it('handles API failures gracefully during connect', async () => {
      const user = userEvent.setup()
      
      const userWithoutWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: true,
        isEmailVerified: true,
      }

      mockWalletService.connectWallet.mockRejectedValue(new Error('Server error'))

      render(<Settings />, {
        initialState: {
          user: { user: userWithoutWallet },
        },
      })

      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      const connectMetaMaskButton = screen.getByTestId('connect-metamask')
      await user.click(connectMetaMaskButton)

      await waitFor(() => {
        expect(mockToast.warning).toHaveBeenCalledWith(
          'Wallet connected locally. Server sync may have failed.'
        )
      })

      // Should still connect locally for better UX
      expect(mockWalletService.connectWallet).toHaveBeenCalled()
    })
  })

  describe('User Experience', () => {
    it('shows appropriate loading states', async () => {
      const user = userEvent.setup()
      
      const userWithWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: true,
        isEmailVerified: true,
        walletInfo: mockWalletInfo,
      }

      // Mock delayed disconnect
      mockWalletService.disconnectWallet.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ status: 'success' }), 100))
      )
      mockWalletService.isWalletConnected.mockReturnValue(true)

      render(<Settings />, {
        initialState: {
          user: { user: userWithWallet },
        },
      })

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      // Should show loading state
      expect(screen.getByText('Disconnecting...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /disconnecting/i })).toBeDisabled()

      // Wait for completion
      await waitFor(() => {
        expect(screen.queryByText('Disconnecting...')).not.toBeInTheDocument()
      }, { timeout: 200 })
    })

    it('provides clear feedback for all actions', async () => {
      const user = userEvent.setup()
      
      const userWithWallet = {
        _id: 'user-123',
        email: 'test@example.com',
        isVerified: true,
        isEmailVerified: true,
        walletInfo: mockWalletInfo,
      }

      mockWalletService.isWalletConnected.mockReturnValue(true)

      render(<Settings />, {
        initialState: {
          user: { user: userWithWallet },
        },
      })

      // Test copy wallet address
      const copyButton = screen.getByTitle('Copy wallet address')
      await user.click(copyButton)

      expect(mockToast.success).toHaveBeenCalledWith('Wallet address copied to clipboard!')
    })
  })
})
