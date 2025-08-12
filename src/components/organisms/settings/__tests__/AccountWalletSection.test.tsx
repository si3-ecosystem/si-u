import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import { AccountWalletSection } from '../AccountWalletSection'
import { WalletService } from '@/services/walletService'
import { UnifiedAuthService } from '@/services/authService'
import { toast } from 'sonner'

// Mock the services and components
jest.mock('@/services/walletService')
jest.mock('@/services/authService')
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
        <button onClick={() => onOpenChange(false)} data-testid="close-dialog">
          Close
        </button>
      </div>
    ) : null
  )
}))

const mockWalletService = WalletService as jest.Mocked<typeof WalletService>
const mockUnifiedAuthService = UnifiedAuthService as jest.Mocked<typeof UnifiedAuthService>
const mockToast = toast as jest.Mocked<typeof toast>

describe('AccountWalletSection', () => {
  const defaultProps = {
    onDisconnectWallet: jest.fn(),
    onConnectWallet: jest.fn(),
  }

  const mockWalletInfo = {
    address: '0x1234567890123456789012345678901234567890',
    connectedWallet: 'MetaMask' as const,
    network: 'Mainnet' as const,
    connectedAt: '2024-08-10T10:00:00Z',
  }

  const mockUserWithVerifiedEmail = {
    _id: 'user-123',
    email: 'test@example.com',
    isVerified: true,
    isEmailVerified: true,
    walletInfo: mockWalletInfo,
  }

  const mockUserWithUnverifiedEmail = {
    ...mockUserWithVerifiedEmail,
    isVerified: false,
    isEmailVerified: false,
  }

  const mockUserWithoutWallet = {
    ...mockUserWithVerifiedEmail,
    walletInfo: undefined,
    wallet_address: undefined,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    mockWalletService.getWalletInfo.mockResolvedValue({
      status: 'success',
      data: {
        walletInfo: mockWalletInfo,
        isConnected: true,
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
    mockWalletService.isWalletConnected.mockReturnValue(true)

    mockUnifiedAuthService.refreshUserData.mockResolvedValue({} as any)

    mockToast.success = jest.fn()
    mockToast.error = jest.fn()
    mockToast.warning = jest.fn()
  })

  describe('Rendering', () => {
    it('renders wallet information when user has connected wallet', () => {
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithVerifiedEmail },
          },
        }
      )

      expect(screen.getByText('Account & Wallet')).toBeInTheDocument()
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
      expect(screen.getByText('MetaMask')).toBeInTheDocument()
      expect(screen.getByText('Ethereum Mainnet')).toBeInTheDocument()
      expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument()
    })

    it('renders connect wallet button when no wallet is connected', () => {
      mockWalletService.isWalletConnected.mockReturnValue(false)
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithoutWallet },
          },
        }
      )

      expect(screen.getByText('No wallet connected')).toBeInTheDocument()
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
      expect(screen.queryByText('Disconnect Wallet')).not.toBeInTheDocument()
    })

    it('shows email verification warning when email is not verified', () => {
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithUnverifiedEmail },
          },
        }
      )

      expect(screen.getByText(/Please verify your email address/)).toBeInTheDocument()
    })

    it('disables disconnect button when email is not verified', () => {
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithUnverifiedEmail },
          },
        }
      )

      const disconnectButton = screen.getByText('Disconnect Wallet')
      expect(disconnectButton).toBeDisabled()
    })
  })

  describe('Wallet Disconnect Functionality', () => {
    it('successfully disconnects wallet when email is verified', async () => {
      const user = userEvent.setup()
      const mockDispatch = jest.fn()

      // Mock useAppDispatch
      jest.doMock('@/redux/store', () => ({
        ...jest.requireActual('@/redux/store'),
        useAppDispatch: () => mockDispatch,
      }))

      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithVerifiedEmail },
          },
        }
      )

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      await waitFor(() => {
        expect(mockWalletService.disconnectWallet).toHaveBeenCalled()
      })

      // Verify Redux store is updated to clear wallet data
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            wallet_address: undefined,
            walletInfo: undefined,
          },
        })
      )

      expect(mockUnifiedAuthService.refreshUserData).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith(
        'Wallet disconnected successfully. You can reconnect a wallet anytime.'
      )
      expect(defaultProps.onDisconnectWallet).toHaveBeenCalled()
    })

    it('clears wallet data from Redux store even on API failure', async () => {
      const user = userEvent.setup()
      const mockDispatch = jest.fn()
      mockWalletService.disconnectWallet.mockRejectedValue(new Error('API Error'))

      // Mock useAppDispatch
      jest.doMock('@/redux/store', () => ({
        ...jest.requireActual('@/redux/store'),
        useAppDispatch: () => mockDispatch,
      }))

      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithVerifiedEmail },
          },
        }
      )

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      await waitFor(() => {
        expect(mockToast.warning).toHaveBeenCalledWith(
          'Wallet disconnected locally. Server sync failed.'
        )
      })

      // Verify Redux store is still updated even on API failure
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            wallet_address: undefined,
            walletInfo: undefined,
          },
        })
      )

      expect(defaultProps.onDisconnectWallet).toHaveBeenCalled()
    })

    it('prevents wallet disconnect when email is not verified', async () => {
      const user = userEvent.setup()
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithUnverifiedEmail },
          },
        }
      )

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      expect(mockWalletService.disconnectWallet).not.toHaveBeenCalled()
      expect(mockToast.error).toHaveBeenCalledWith(
        'Please verify your email address before disconnecting your wallet. This ensures you can still access your account.'
      )
    })

    it('handles disconnect API failure gracefully', async () => {
      const user = userEvent.setup()
      mockWalletService.disconnectWallet.mockRejectedValue(new Error('API Error'))
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithVerifiedEmail },
          },
        }
      )

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      await waitFor(() => {
        expect(mockToast.warning).toHaveBeenCalledWith(
          'Wallet disconnected locally. Server sync failed.'
        )
      })
      
      expect(defaultProps.onDisconnectWallet).toHaveBeenCalled()
    })

    it('shows loading state during disconnect', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response
      mockWalletService.disconnectWallet.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ status: 'success' }), 100))
      )
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithVerifiedEmail },
          },
        }
      )

      const disconnectButton = screen.getByText('Disconnect Wallet')
      await user.click(disconnectButton)

      expect(screen.getByText('Disconnecting...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /disconnecting/i })).toBeDisabled()

      await waitFor(() => {
        expect(screen.queryByText('Disconnecting...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Wallet Connect Functionality', () => {
    beforeEach(() => {
      mockWalletService.isWalletConnected.mockReturnValue(false)
    })

    it('opens wallet dialog when connect button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithoutWallet },
          },
        }
      )

      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      expect(screen.getByTestId('wallet-dialog')).toBeInTheDocument()
    })

    it('successfully connects wallet through dialog', async () => {
      const user = userEvent.setup()
      const mockDispatch = jest.fn()

      // Mock useAppDispatch
      jest.doMock('@/redux/store', () => ({
        ...jest.requireActual('@/redux/store'),
        useAppDispatch: () => mockDispatch,
      }))

      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithoutWallet },
          },
        }
      )

      // Open wallet dialog
      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      // Connect MetaMask
      const connectMetaMaskButton = screen.getByTestId('connect-metamask')
      await user.click(connectMetaMaskButton)

      await waitFor(() => {
        expect(mockWalletService.connectWallet).toHaveBeenCalledWith({
          address: '0x1234567890123456789012345678901234567890',
          connectedWallet: 'MetaMask',
          network: 'Mainnet',
        })
      })

      // Verify Redux store is updated with wallet data
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            wallet_address: '0x1234567890123456789012345678901234567890',
            walletInfo: mockWalletInfo,
          },
        })
      )

      expect(mockUnifiedAuthService.refreshUserData).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith('Wallet connected successfully!')
      expect(defaultProps.onConnectWallet).toHaveBeenCalled()
    })

    it('updates Redux store with wallet data even on API failure', async () => {
      const user = userEvent.setup()
      const mockDispatch = jest.fn()
      mockWalletService.connectWallet.mockRejectedValue(new Error('API Error'))

      // Mock useAppDispatch
      jest.doMock('@/redux/store', () => ({
        ...jest.requireActual('@/redux/store'),
        useAppDispatch: () => mockDispatch,
      }))

      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithoutWallet },
          },
        }
      )

      // Open wallet dialog and connect
      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      const connectMetaMaskButton = screen.getByTestId('connect-metamask')
      await user.click(connectMetaMaskButton)

      await waitFor(() => {
        expect(mockToast.warning).toHaveBeenCalledWith(
          'Wallet connected locally. Server sync may have failed.'
        )
      })

      // Verify Redux store is still updated even on API failure
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            wallet_address: '0x1234567890123456789012345678901234567890',
            walletInfo: expect.objectContaining({
              address: '0x1234567890123456789012345678901234567890',
              connectedWallet: 'Other',
              network: 'Mainnet',
            }),
          },
        })
      )

      expect(defaultProps.onConnectWallet).toHaveBeenCalled()
    })

    it('handles connect API failure gracefully', async () => {
      const user = userEvent.setup()
      mockWalletService.connectWallet.mockRejectedValue(new Error('API Error'))
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithoutWallet },
          },
        }
      )

      // Open wallet dialog and connect
      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      const connectMetaMaskButton = screen.getByTestId('connect-metamask')
      await user.click(connectMetaMaskButton)

      await waitFor(() => {
        expect(mockToast.warning).toHaveBeenCalledWith(
          'Wallet connected locally. Server sync may have failed.'
        )
      })
      
      expect(defaultProps.onConnectWallet).toHaveBeenCalled()
    })

    it('shows loading state during connect', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response
      mockWalletService.connectWallet.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          status: 'success',
          data: { walletInfo: mockWalletInfo, message: 'Success' }
        }), 100))
      )
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithoutWallet },
          },
        }
      )

      const connectButton = screen.getByText('Connect Wallet')
      await user.click(connectButton)

      const connectMetaMaskButton = screen.getByTestId('connect-metamask')
      await user.click(connectMetaMaskButton)

      expect(screen.getByText('Connecting...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText('Connecting...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Copy Wallet Address', () => {
    it('copies wallet address to clipboard', async () => {
      const user = userEvent.setup()
      const mockWriteText = jest.fn()
      
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: mockUserWithVerifiedEmail },
          },
        }
      )

      const copyButton = screen.getByTitle('Copy wallet address')
      await user.click(copyButton)

      expect(mockWriteText).toHaveBeenCalledWith(mockWalletInfo.address)
      expect(mockToast.success).toHaveBeenCalledWith('Wallet address copied to clipboard!')
    })
  })

  describe('Loading States', () => {
    it('shows loading spinner while fetching wallet info', () => {
      mockWalletService.getWalletInfo.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )
      
      render(
        <AccountWalletSection {...defaultProps} />,
        {
          initialState: {
            user: { user: {} }, // Empty user to trigger API call
          },
        }
      )

      expect(screen.getByText('Loading wallet information...')).toBeInTheDocument()
    })
  })
})
