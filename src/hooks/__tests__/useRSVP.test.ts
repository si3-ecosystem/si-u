import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { useRSVP } from '../useRSVP'
import { RSVPService } from '@/services/rsvpService'
import { ErrorHandler } from '@/utils/errorHandler'
import { RSVPStatus } from '@/types/rsvp'
import { createMockStore } from '@/test-utils'
import {
  mockSession,
  mockRSVP,
  mockCreateRSVPResponse,
  mockUpdateRSVPResponse,
  mockDeleteRSVPResponse,
  mockAPIError,
  mockUserWithVerifiedEmail,
  mockUserWithUnverifiedEmail,
} from '@/test-utils/mockData'
import React from 'react'

// Mock the services and utilities
jest.mock('@/services/rsvpService')
jest.mock('@/utils/errorHandler')

const mockRSVPService = RSVPService as jest.Mocked<typeof RSVPService>
const mockErrorHandler = ErrorHandler as jest.Mocked<typeof ErrorHandler>

describe('useRSVP', () => {
  let queryClient: QueryClient
  let wrapper: React.FC<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const store = createMockStore({
      user: mockUserWithVerifiedEmail,
    })

    wrapper = ({ children }) => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    )

    // Setup default mocks
    mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
      status: 'success',
      data: null,
    })
    mockRSVPService.createRSVP.mockResolvedValue(mockCreateRSVPResponse)
    mockRSVPService.updateRSVP.mockResolvedValue(mockUpdateRSVPResponse)
    mockRSVPService.deleteRSVP.mockResolvedValue(mockDeleteRSVPResponse)
  })

  describe('Initial State', () => {
    it('returns correct initial state when no RSVP exists', async () => {
      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.rsvp).toBeNull()
      expect(result.current.rsvpStatus).toBeNull()
      expect(result.current.hasRSVP).toBe(false)
      expect(result.current.isCreating).toBe(false)
      expect(result.current.isUpdating).toBe(false)
      expect(result.current.isDeleting).toBe(false)
    })

    it('returns existing RSVP when user has one', async () => {
      mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
        status: 'success',
        data: mockRSVP,
      })

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.rsvp).toEqual(mockRSVP)
      expect(result.current.rsvpStatus).toBe(RSVPStatus.ATTENDING)
      expect(result.current.hasRSVP).toBe(true)
    })
  })

  describe('RSVP Configuration', () => {
    it('returns correct configuration for enabled RSVP', async () => {
      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.config.isRSVPEnabled).toBe(true)
      expect(result.current.config.hasValidEmail).toBe(true)
      expect(result.current.config.canUserRSVP).toBe(true)
      expect(result.current.config.requiresApproval).toBe(false)
      expect(result.current.config.allowsGuests).toBe(true)
      expect(result.current.config.maxGuests).toBe(2)
    })

    it('handles disabled RSVP configuration', async () => {
      const sessionWithDisabledRSVP = {
        ...mockSession,
        rsvpSettings: {
          ...mockSession.rsvpSettings!,
          enabled: false,
        },
      }

      const { result } = renderHook(
        () => useRSVP('session-123', sessionWithDisabledRSVP),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.config.isRSVPEnabled).toBe(false)
    })

    it('handles user with unverified email', async () => {
      const storeWithUnverifiedUser = createMockStore({
        user: mockUserWithUnverifiedEmail,
      })

      const wrapperWithUnverifiedUser = ({ children }: { children: React.ReactNode }) => (
        <Provider store={storeWithUnverifiedUser}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </Provider>
      )

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper: wrapperWithUnverifiedUser }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.config.hasValidEmail).toBe(false)
      expect(result.current.config.canUserRSVP).toBe(false)
    })
  })

  describe('RSVP Operations', () => {
    it('creates RSVP successfully', async () => {
      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createData = {
        eventId: 'session-123',
        status: RSVPStatus.ATTENDING,
        guestCount: 1,
      }

      result.current.createRSVP(createData)

      expect(mockRSVPService.createRSVP).toHaveBeenCalledWith(createData)
    })

    it('prevents RSVP creation when user email is not verified', async () => {
      const storeWithUnverifiedUser = createMockStore({
        user: mockUserWithUnverifiedEmail,
      })

      const wrapperWithUnverifiedUser = ({ children }: { children: React.ReactNode }) => (
        <Provider store={storeWithUnverifiedUser}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </Provider>
      )

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper: wrapperWithUnverifiedUser }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createData = {
        eventId: 'session-123',
        status: RSVPStatus.ATTENDING,
        guestCount: 1,
      }

      result.current.createRSVP(createData)

      expect(mockRSVPService.createRSVP).not.toHaveBeenCalled()
      expect(mockErrorHandler.showWarning).toHaveBeenCalledWith(
        'Please update your email address in your profile before RSVPing'
      )
    })

    it('updates RSVP successfully', async () => {
      mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
        status: 'success',
        data: mockRSVP,
      })

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const updateData = { status: RSVPStatus.MAYBE }
      result.current.updateRSVP(updateData)

      expect(mockRSVPService.updateRSVP).toHaveBeenCalledWith(mockRSVP._id, updateData)
    })

    it('deletes RSVP successfully', async () => {
      mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
        status: 'success',
        data: mockRSVP,
      })

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      result.current.deleteRSVP()

      expect(mockRSVPService.deleteRSVP).toHaveBeenCalledWith(mockRSVP._id)
    })
  })

  describe('Error Handling', () => {
    it('handles RSVP creation errors', async () => {
      mockRSVPService.createRSVP.mockRejectedValue(mockAPIError)

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const createData = {
        eventId: 'session-123',
        status: RSVPStatus.ATTENDING,
        guestCount: 1,
      }

      result.current.createRSVP(createData)

      await waitFor(() => {
        expect(mockRSVPService.createRSVP).toHaveBeenCalledWith(createData)
      })
    })

    it('handles network errors gracefully', async () => {
      mockRSVPService.getUserRSVPForEvent.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should handle the error gracefully and not crash
      expect(result.current.rsvp).toBeNull()
    })
  })

  describe('Quick Status Update', () => {
    it('updates status for existing RSVP', async () => {
      mockRSVPService.getUserRSVPForEvent.mockResolvedValue({
        status: 'success',
        data: mockRSVP,
      })

      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      result.current.updateStatus(RSVPStatus.MAYBE)

      expect(mockRSVPService.updateRSVP).toHaveBeenCalledWith(
        mockRSVP._id,
        { status: RSVPStatus.MAYBE }
      )
    })

    it('creates new RSVP when updating status without existing RSVP', async () => {
      const { result } = renderHook(
        () => useRSVP('session-123', mockSession),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      result.current.updateStatus(RSVPStatus.ATTENDING)

      expect(mockRSVPService.createRSVP).toHaveBeenCalledWith({
        eventId: 'session-123',
        status: RSVPStatus.ATTENDING,
        guestCount: 1,
      })
    })
  })
})
