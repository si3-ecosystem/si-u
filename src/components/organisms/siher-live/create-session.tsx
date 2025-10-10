// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { X, Calendar, Clock, Globe, Award, Info, CheckCircle, AlertCircle } from "lucide-react"
// import { useAppSelector } from '@/redux/store';
// // Removed direct Sanity imports - now using API routes

// interface CreateSessionModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   existingSession?: any
//   mode?: 'create' | 'edit'
//   onSaved?: (session: any) => void
// }

// interface NotificationState {
//   show: boolean
//   type: 'success' | 'error' | 'warning'
//   title: string
//   message: string
// }

// export default function CreateSessionModal({ open, onOpenChange, existingSession, mode = 'create', onSaved }: CreateSessionModalProps) {
//   const [currentStep, setCurrentStep] = useState(1)

//   const [notification, setNotification] = useState<NotificationState>({
//     show: false,
//     type: 'success',
//     title: '',
//     message: ''
//   })

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     sessionType: "Web3 Education",
//     date: "March, 4th, 2025",
//     startTime: "10:40 am",
//     endTime: "11:40 am",
//     duration: "60 mins",
//     timezone: "(GMT+01:00) Central European Standard Time",
//     accessType: "Public",
//     maxParticipants: "100",
//     proofOfAttendance: true,
//     claimMethod: "Auto-mint",
//     nftTitle: "",
//     claimOpens: "",
//     claimCloses: "",
//     attendanceRequirement: "30 mins",
//     unlockEventLink: "",
//     huddle01Link: "",
//   })

//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const user = useAppSelector((state) => state.authV2.user);
//   // const isBetaTester = user?.email === 'kara@si3.space';
//   const isBetaTester = user?.email === 'shayanabbasi006@gmail.com';

//   // Populate form data when editing existing session
//   useEffect(() => {
//     if (mode === 'edit' && existingSession && open) {
//       setFormData({
//         title: existingSession.title || "",
//         description: existingSession.description || "",
//         sessionType: existingSession.sessionType || "Web3 Education",
//         date: existingSession.date || "March, 4th, 2025",
//         startTime: existingSession.startTime || "10:40 am",
//         endTime: existingSession.endTime || "11:40 am",
//         duration: existingSession.duration || "60 mins",
//         timezone: existingSession.timezone || "(GMT+01:00) Central European Standard Time",
//         accessType: existingSession.accessType || "Public",
//         maxParticipants: existingSession.maxParticipants || "100",
//         proofOfAttendance: existingSession.proofOfAttendance ?? true,
//         claimMethod: existingSession.claimMethod || "Auto-mint",
//         nftTitle: existingSession.nftTitle || "",
//         claimOpens: existingSession.claimOpens || "",
//         claimCloses: existingSession.claimCloses || "",
//         attendanceRequirement: existingSession.attendanceRequirement || "30 mins",
//         unlockEventLink: existingSession.unlockEventLink || "",
//         huddle01Link: existingSession.huddle01Link || "",
//       });
//     } else if (mode === 'create' && open) {
//       // Reset form for new session
//       setFormData({
//         title: "",
//         description: "",
//         sessionType: "Web3 Education",
//         date: "March, 4th, 2025",
//         startTime: "10:40 am",
//         endTime: "11:40 am",
//         duration: "60 mins",
//         timezone: "(GMT+01:00) Central European Standard Time",
//         accessType: "Public",
//         maxParticipants: "100",
//         proofOfAttendance: true,
//         claimMethod: "Auto-mint",
//         nftTitle: "",
//         claimOpens: "",
//         claimCloses: "",
//         attendanceRequirement: "30 mins",
//         unlockEventLink: "",
//         huddle01Link: "",
//       });
//     }
//   }, [mode, existingSession, open]);

//   const steps = [
//     { number: 1, title: "Session Info", active: currentStep === 1, completed: currentStep > 1 },
//     { number: 2, title: "Access Setup", active: currentStep === 2, completed: currentStep > 2 },
//     { number: 3, title: "POAP Setup", active: currentStep === 3, completed: currentStep > 3 },
//     { number: 4, title: "Review", active: currentStep === 4, completed: false },
//   ]

//   // Show notification helper
//   const showNotification = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
//     setNotification({ show: true, type, title, message })
//     // Auto-hide after 5 seconds
//     setTimeout(() => {
//       setNotification(prev => ({ ...prev, show: false }))
//     }, 5000)
//   }

//   const handleNext = () => {
//     if (currentStep < 4) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const handleClose = () => {
//     setCurrentStep(1)
//     setNotification(prev => ({ ...prev, show: false }))
//     onOpenChange(false)
//   }

//   const handleSaveDraft = async () => {
//     if (!isBetaTester) {
//       showNotification(
//         'warning',
//         'Beta Access Required',
//         'Only beta testers can create live sessions at this time.'
//       )
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       const baseData = {
//         ...formData,
//         accessType: 'draft',
//         ...(mode === 'create' && {
//           creator: user?.id,
//         })
//       }

//       let response;
//       if (mode === 'edit' && existingSession?._id) {
//         response = await fetch(`/api/siher-live/${existingSession._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(baseData),
//           cache: 'no-store',
//         });
//       } else {
//         response = await fetch('/api/siher-live', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(baseData),
//           cache: 'no-store',
//         });
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save session');
//       }

//       const result = await response.json();

//       showNotification(
//         'success',
//         mode === 'edit' ? 'Draft Updated' : 'Draft Saved',
//         mode === 'edit' ? 'Your session draft has been updated.' : 'Your session has been saved as draft.'
//       )

//       setTimeout(() => {
//         onOpenChange(false)
//         setCurrentStep(1)
//         setFormData({
//           title: "",
//           description: "",
//           sessionType: "Web3 Education",
//           date: "March, 4th, 2025",
//           startTime: "10:40 am",
//           endTime: "11:40 am",
//           duration: "60 mins",
//           timezone: "(GMT+01:00) Central European Standard Time",
//           accessType: "Public",
//           maxParticipants: "100",
//           proofOfAttendance: true,
//           claimMethod: "Auto-mint",
//           nftTitle: "",
//           claimOpens: "",
//           claimCloses: "",
//           attendanceRequirement: "30 mins",
//           unlockEventLink: "",
//           huddle01Link: "",
//         })
//         onSaved?.(result.data)
//       }, 2000)
//     } catch (error) {
//       console.error("Error saving draft:", error)
//       showNotification(
//         'error',
//         'Error',
//         'Failed to save draft. Please try again.'
//       )
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleGoLive = async () => {
//     if (!isBetaTester) {
//       showNotification(
//         'warning',
//         'Beta Access Required',
//         'Only beta testers can create live sessions at this time.'
//       )
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       const baseData = {
//         ...formData,
//         accessType: 'public',
//         ...(mode === 'create' && {
//           creator: user?.id,
//         })
//       }

//       let response;
//       if (mode === 'edit' && existingSession?._id) {
//         response = await fetch(`/api/siher-live/${existingSession._id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(baseData),
//           cache: 'no-store',
//         });
//       } else {
//         response = await fetch('/api/siher-live', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(baseData),
//           cache: 'no-store',
//         });
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save session');
//       }

//       const result = await response.json();

//       showNotification(
//         'success',
//         mode === 'edit' ? 'Session Updated' : 'Session Created',
//         mode === 'edit' ? 'Your session has been updated successfully!' : 'Your live session has been created successfully!'
//       )

//       // Close the modal and reset the form after a brief delay
//       setTimeout(() => {
//         onOpenChange(false)
//         setCurrentStep(1)
//         setFormData({
//           title: "",
//           description: "",
//           sessionType: "Web3 Education",
//           date: "March, 4th, 2025",
//           startTime: "10:40 am",
//           endTime: "11:40 am",
//           duration: "60 mins",
//           timezone: "(GMT+01:00) Central European Standard Time",
//           accessType: "Public",
//           maxParticipants: "100",
//           proofOfAttendance: true,
//           claimMethod: "Auto-mint",
//           nftTitle: "",
//           claimOpens: "",
//           claimCloses: "",
//           attendanceRequirement: "30 mins",
//           unlockEventLink: "",
//           huddle01Link: "",
//         })
//         onSaved?.(result.data)
//       }, 2000)
//     } catch (error) {
//       console.error("Error creating session:", error)
//       showNotification(
//         'error',
//         'Error',
//         'Failed to create session. Please try again.'
//       )
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const renderNotification = () => {
//     if (!notification.show) return null

//     return (
//       <div className="fixed top-4 right-4 z-50 max-w-sm">
//         <Alert className={`border-l-4 ${notification.type === 'success' ? 'border-l-green-500 bg-green-50' :
//           notification.type === 'error' ? 'border-l-red-500 bg-red-50' :
//             'border-l-yellow-500 bg-yellow-50'
//           }`}>
//           <div className="flex items-start gap-3">
//             {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
//             {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
//             {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />}
//             <div className="flex-1">
//               <h4 className={`font-medium text-sm ${notification.type === 'success' ? 'text-green-800' :
//                 notification.type === 'error' ? 'text-red-800' :
//                   'text-yellow-800'
//                 }`}>
//                 {notification.title}
//               </h4>
//               <AlertDescription className={`text-sm ${notification.type === 'success' ? 'text-green-700' :
//                 notification.type === 'error' ? 'text-red-700' :
//                   'text-yellow-700'
//                 }`}>
//                 {notification.message}
//               </AlertDescription>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="p-1 h-auto"
//               onClick={() => setNotification(prev => ({ ...prev, show: false }))}
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </Alert>
//       </div>
//     )
//   }

//   const renderStepIndicator = () => (
//     <div className="flex items-center justify-center mb-8 px-6">
//       {steps.map((step, index) => (
//         <div key={step.number} className="flex items-center">
//           <div className="flex flex-col items-center">
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.completed
//                 ? "bg-purple-600 text-white"
//                 : step.active
//                   ? "bg-purple-600 text-white"
//                   : "bg-gray-200 text-gray-500"
//                 }`}
//             >
//               {step.number}
//             </div>
//             <span className={`text-xs mt-1 ${step.active ? "text-gray-900 font-medium" : "text-gray-500"}`}>
//               {step.title}
//             </span>
//           </div>
//           {index < steps.length - 1 && (
//             <div className={`w-16 h-px mx-4 ${step.completed ? "bg-purple-600" : "bg-gray-200"}`} />
//           )}
//         </div>
//       ))}
//     </div>
//   )

//   const renderSessionInfo = () => (
//     <div className="px-6 pb-6">
//       <div className="space-y-6">
//         <div>
//           <Label htmlFor="title" className="text-sm font-medium text-gray-900">
//             Title
//           </Label>
//           <Input
//             id="title"
//             placeholder="Session Title..."
//             value={formData.title}
//             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//             className="mt-1"
//           />
//         </div>

//         <div>
//           <Label htmlFor="description" className="text-sm font-medium text-gray-900">
//             Description
//           </Label>
//           <Textarea
//             id="description"
//             placeholder="Session description..."
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             className="mt-1 min-h-[80px]"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label className="text-sm font-medium text-gray-900">Session Type</Label>
//             <Select
//               value={formData.sessionType}
//               onValueChange={(value) => setFormData({ ...formData, sessionType: value })}
//             >
//               <SelectTrigger className="mt-1">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Web3 Education">Web3 Education</SelectItem>
//                 <SelectItem value="Interview">Interview</SelectItem>
//                 <SelectItem value="BTS (Behind-the-Scenes)">BTS (Behind-the-Scenes)</SelectItem>
//                 <SelectItem value="Lifestyle Show">Lifestyle Show</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* <div>
//             <Label className="text-sm font-medium text-gray-900">Date</Label>
//             <div className="relative mt-1">
//               <Input value={formData.date} readOnly className="pr-10" />
//               <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             </div>
//           </div> */}
//           <div>
//             <Label htmlFor="date" className="text-sm font-medium text-gray-900">Date</Label>
//             <Input
//               id="date"
//               type="date"
//               value={formData.date}
//               onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//               className="mt-1"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <div>
//               <Label htmlFor="startTime" className="text-sm font-medium text-gray-900">Start Time</Label>
//               <Input
//                 id="startTime"
//                 type="time"
//                 value={formData.startTime}
//                 onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
//                 className="mt-1"
//               />
//             </div>
//           </div>

//           <div>
//             <Label className="text-sm font-medium text-gray-900">Duration</Label>
//             <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="30 mins">30 mins</SelectItem>
//                 <SelectItem value="60 mins">60 mins</SelectItem>
//                 <SelectItem value="90 mins">90 mins</SelectItem>
//                 <SelectItem value="120 mins">120 mins</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="relative">
//           <Label className="text-sm font-medium text-gray-900">Time Zone</Label>
//           <Select
//             value={formData.timezone}
//             onValueChange={(value) => setFormData({ ...formData, timezone: value })}
//           >
//             <SelectTrigger className="mt-1 text-left">
//               <Globe className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
//               <SelectValue placeholder="Select time zone" />
//             </SelectTrigger>
//             <SelectContent className="max-h-[300px] overflow-y-auto">
//               <div className="sticky top-0 bg-background z-10 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
//                 Common Time Zones
//               </div>
//               {[
//                 { value: '(GMT+00:00) Greenwich Mean Time', label: 'Greenwich Mean Time (GMT)' },
//                 { value: '(GMT-05:00) Eastern Standard Time', label: 'Eastern Time (ET)' },
//                 { value: '(GMT-06:00) Central Standard Time', label: 'Central Time (CT)' },
//                 { value: '(GMT-08:00) Pacific Standard Time', label: 'Pacific Time (PT)' },
//                 { value: '(GMT+01:00) Central European Standard Time', label: 'Central European Time (CET)' },
//                 { value: '(GMT+05:30) India Standard Time', label: 'India Standard Time (IST)' },
//                 { value: '(GMT+08:00) China Standard Time', label: 'China Standard Time (CST)' },
//                 { value: '(GMT+09:00) Japan Standard Time', label: 'Japan Standard Time (JST)' },
//                 { value: '(GMT+10:00) Australian Eastern Standard Time', label: 'Australian Eastern Time (AET)' },
//               ].map((zone) => (
//                 <SelectItem key={zone.value} value={zone.value}>
//                   <div className="flex items-center">
//                     <span className="font-medium">{zone.label.split(' (')[0]}</span>
//                     <span className="ml-2 text-muted-foreground">
//                       {zone.value.split(') ')[0]})
//                     </span>
//                   </div>
//                 </SelectItem>
//               ))}

//               <div className="sticky top-0 bg-background z-10 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-t">
//                 All Time Zones
//               </div>

//               {[
//                 '(GMT-12:00) International Date Line West',
//                 '(GMT-11:00) Midway Island, Samoa',
//                 '(GMT-10:00) Hawaii',
//                 '(GMT-09:00) Alaska',
//                 '(GMT-08:00) Pacific Time (US & Canada)',
//                 '(GMT-07:00) Arizona',
//                 '(GMT-07:00) Mountain Time (US & Canada)',
//                 '(GMT-06:00) Central America',
//                 '(GMT-06:00) Central Time (US & Canada)',
//                 '(GMT-06:00) Mexico City',
//                 '(GMT-06:00) Saskatchewan',
//                 '(GMT-05:00) Bogota, Lima, Quito',
//                 '(GMT-05:00) Eastern Time (US & Canada)',
//                 '(GMT-05:00) Indiana (East)',
//                 '(GMT-04:30) Caracas',
//                 '(GMT-04:00) Asuncion',
//                 '(GMT-04:00) Atlantic Time (Canada)',
//                 '(GMT-04:00) Georgetown, La Paz, Manaus',
//                 '(GMT-04:00) Santiago',
//                 '(GMT-03:30) Newfoundland',
//                 '(GMT-03:00) Brasilia',
//                 '(GMT-03:00) Buenos Aires',
//                 '(GMT-03:00) Greenland',
//                 '(GMT-03:00) Montevideo',
//                 '(GMT-02:00) Mid-Atlantic',
//                 '(GMT-01:00) Azores',
//                 '(GMT-01:00) Cape Verde Is.',
//                 '(GMT+00:00) Casablanca',
//                 '(GMT+00:00) Dublin, Edinburgh, Lisbon, London',
//                 '(GMT+00:00) Monrovia, Reykjavik',
//                 '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
//                 '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
//                 '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
//                 '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
//                 '(GMT+01:00) West Central Africa',
//                 '(GMT+02:00) Amman',
//                 '(GMT+02:00) Athens, Bucharest',
//                 '(GMT+02:00) Beirut',
//                 '(GMT+02:00) Cairo',
//                 '(GMT+02:00) Chisinau',
//                 '(GMT+02:00) Damascus',
//                 '(GMT+02:00) Harare, Pretoria',
//                 '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
//                 '(GMT+02:00) Jerusalem',
//                 '(GMT+02:00) Windhoek',
//                 '(GMT+03:00) Baghdad',
//                 '(GMT+03:00) Kuwait, Riyadh',
//                 '(GMT+03:00) Minsk',
//                 '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
//                 '(GMT+03:00) Nairobi',
//                 '(GMT+03:30) Tehran',
//                 '(GMT+04:00) Abu Dhabi, Muscat',
//                 '(GMT+04:00) Baku',
//                 '(GMT+04:00) Tbilisi',
//                 '(GMT+04:00) Yerevan',
//                 '(GMT+04:30) Kabul',
//                 '(GMT+05:00) Islamabad, Karachi',
//                 '(GMT+05:00) Tashkent',
//                 '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
//                 '(GMT+05:45) Kathmandu',
//                 '(GMT+06:00) Astana',
//                 '(GMT+06:00) Dhaka',
//                 '(GMT+06:30) Yangon (Rangoon)',
//                 '(GMT+07:00) Bangkok, Hanoi, Jakarta',
//                 '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
//                 '(GMT+08:00) Kuala Lumpur, Singapore',
//                 '(GMT+08:00) Perth',
//                 '(GMT+08:00) Taipei',
//                 '(GMT+09:00) Osaka, Sapporo, Tokyo',
//                 '(GMT+09:00) Seoul',
//                 '(GMT+09:30) Adelaide',
//                 '(GMT+09:30) Darwin',
//                 '(GMT+10:00) Brisbane',
//                 '(GMT+10:00) Canberra, Melbourne, Sydney',
//                 '(GMT+10:00) Guam, Port Moresby',
//                 '(GMT+10:00) Hobart',
//                 '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
//                 '(GMT+12:00) Auckland, Wellington',
//                 '(GMT+12:00) Fiji',
//                 '(GMT+13:00) Nuku\'alofa',
//               ].map((timezone) => (
//                 <SelectItem key={timezone} value={timezone} className="py-2">
//                   <div className="flex items-center">
//                     <span className="font-medium">{timezone.split(') ')[1]}</span>
//                     <span className="ml-2 text-muted-foreground">
//                       {timezone.split(') ')[0]})
//                     </span>
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   )

//   const renderAccessSetup = () => (
//     <div className="px-6 pb-6">
//       <div className="space-y-6">
//         <div>
//           <Label className="text-sm font-medium text-gray-900 mb-3 block">Access Type</Label>
//           <div className="grid grid-cols-3 gap-2">
//             {["Public", "Token-Gated", "Private"].map((type) => (
//               <Button
//                 key={type}
//                 variant={formData.accessType === type ? "default" : "outline"}
//                 className={`${formData.accessType === type
//                   ? "bg-purple-600 hover:bg-purple-700 text-white"
//                   : "bg-transparent text-gray-600 hover:bg-gray-50"
//                   }`}
//                 onClick={() => setFormData({ ...formData, accessType: type })}
//               >
//                 {type}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <Label className="text-sm font-medium text-gray-900">Max Participant</Label>
//             <Info className="w-4 h-4 text-gray-400" />
//             <span className="text-sm text-gray-500">(Optional)</span>
//           </div>
//           <Input
//             placeholder="Set max capacity..."
//             value={formData.maxParticipants}
//             onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
//             className="mt-1"
//           />
//         </div>
//       </div>
//     </div>
//   )

//   const renderPOAPSetup = () => (
//     <div className="px-6 pb-6">
//       <div className="space-y-6">
//         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//           <div className="flex items-center gap-3">
//             <Award className="w-5 h-5 text-gray-700" />
//             <span className="font-medium text-gray-900">Enable Proof of Attendance</span>
//           </div>
//           <Switch
//             checked={formData.proofOfAttendance}
//             onCheckedChange={(checked) => setFormData({ ...formData, proofOfAttendance: checked })}
//           />
//         </div>

//         <p className="text-sm text-gray-600 -mt-2">
//           Automatically reward attendees with a collectible badge for joining this session.
//         </p>

//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <Label className="text-sm font-medium text-gray-900">Claim Method</Label>
//             <Info className="w-4 h-4 text-gray-400" />
//           </div>
//           <Select
//             value={formData.claimMethod}
//             onValueChange={(value) => setFormData({ ...formData, claimMethod: value })}
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Auto-mint">Auto-mint</SelectItem>
//               <SelectItem value="Manual-claim">Manual-claim</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* <div>
//           <Label className="text-sm font-medium text-gray-900">Session Title</Label>
//           <Input
//             placeholder="Enter session title"
//             value={formData.nftTitle}
//             onChange={(e) => setFormData({ ...formData, nftTitle: e.target.value })}
//             className="mt-1"
//           />
//         </div> */}

//         <div>
//           <Label className="text-sm font-medium text-gray-900">Unlock NFT Event Link</Label>
//           <Input
//             placeholder="https://app.unlock-protocol.com/locks/..."
//             value={formData.unlockEventLink || ''}
//             onChange={(e) => setFormData({ ...formData, unlockEventLink: e.target.value })}
//             className="mt-1"
//           />
//         </div>

//         <div>
//           <Label className="text-sm font-medium text-gray-900">Huddle01 Video Link</Label>
//           <Input
//             placeholder="https://huddle01.com/..."
//             value={formData.huddle01Link || ''}
//             onChange={(e) => setFormData({ ...formData, huddle01Link: e.target.value })}
//             className="mt-1"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="claimOpens" className="text-sm font-medium text-gray-900">Claim Opens</Label>
//             <Input
//               id="claimOpens"
//               type="date"
//               value={formData.claimOpens}
//               onChange={(e) => setFormData({ ...formData, claimOpens: e.target.value })}
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <Label htmlFor="claimCloses" className="text-sm font-medium text-gray-900">Claim Closes</Label>
//             <Input
//               id="claimCloses"
//               type="date"
//               value={formData.claimCloses}
//               onChange={(e) => setFormData({ ...formData, claimCloses: e.target.value })}
//               className="mt-1"
//             />
//           </div>
//         </div>

//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <Label className="text-sm font-medium text-gray-900">Attendance Requirement</Label>
//             <Info className="w-4 h-4 text-gray-400" />
//           </div>
//           <Select
//             value={formData.attendanceRequirement}
//             onValueChange={(value) => setFormData({ ...formData, attendanceRequirement: value })}
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="15 mins">15 mins</SelectItem>
//               <SelectItem value="30 mins">30 mins</SelectItem>
//               <SelectItem value="45 mins">45 mins</SelectItem>
//               <SelectItem value="60 mins">60 mins</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   )

//   const renderReview = () => (
//     <div className="px-6 pb-6">
//       <div className="space-y-6">
//         {/* Session Info Summary */}
//         <div className="bg-gray-50 rounded-lg p-4">
//           <h3 className="font-medium text-gray-900 mb-3">Session Info</h3>
//           <div className="space-y-2">
//             <div className="text-sm">
//               <span className="text-gray-600 font-medium">Title:</span>{' '}
//               <span className="text-gray-900">{formData.title || 'Not specified'}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 font-medium">Description:</span>{' '}
//               <span className="text-gray-900">{formData.description || 'Not specified'}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 font-medium">Type:</span>{' '}
//               <span className="text-gray-900">{formData.sessionType}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 font-medium">Date & Time:</span>{' '}
//               <span className="text-gray-900">
//                 {formData.date} • {formData.startTime} - {formData.endTime} ({formData.timezone})
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Access Summary */}
//         <div className="bg-gray-50 rounded-lg p-4">
//           <h3 className="font-medium text-gray-900 mb-3">Access</h3>
//           <div className="space-y-2">
//             <div className="text-sm">
//               <span className="text-gray-600 font-medium">Access Type:</span>{' '}
//               <span className="text-gray-900">{formData.accessType}</span>
//             </div>
//             {formData.accessType === 'Public' && formData.maxParticipants && (
//               <div className="text-sm">
//                 <span className="text-gray-600 font-medium">Max Participants:</span>{' '}
//                 <span className="text-gray-900">{formData.maxParticipants}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Proof of Attendance Summary */}
//         {formData.proofOfAttendance && (
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-medium text-gray-900 mb-3">Proof of Attendance</h3>
//             <div className="space-y-2">
//               <div className="text-sm">
//                 <span className="text-gray-600 font-medium">Status:</span>{' '}
//                 <span className="text-gray-900">Enabled</span>
//               </div>
//               <div className="text-sm">
//                 <span className="text-gray-600 font-medium">Claim Method:</span>{' '}
//                 <span className="text-gray-900">{formData.claimMethod}</span>
//               </div>
//               {formData.nftTitle && (
//                 <div className="text-sm">
//                   <span className="text-gray-600 font-medium">Session Title:</span>{' '}
//                   <span className="text-gray-900">{formData.nftTitle}</span>
//                 </div>
//               )}
//               <div className="text-sm">
//                 <span className="text-gray-600 font-medium">Attendance Requirement:</span>{' '}
//                 <span className="text-gray-900">{formData.attendanceRequirement}</span>
//               </div>
//               {(formData.claimOpens || formData.claimCloses) && (
//                 <div className="text-sm">
//                   <span className="text-gray-600 font-medium">Claim Period:</span>{' '}
//                   <span className="text-gray-900">
//                     {formData.claimOpens || 'Not specified'} to {formData.claimCloses || 'Not specified'}
//                   </span>
//                 </div>
//               )}
//               {formData.unlockEventLink && (
//                 <div className="text-sm">
//                   <span className="text-gray-600 font-medium">Unlock NFT Event Link:</span>{' '}
//                   <span className="text-gray-900">{formData.unlockEventLink}</span>
//                 </div>
//               )}
//               {formData.huddle01Link && (
//                 <div className="text-sm">
//                   <span className="text-gray-600 font-medium">Huddle01 Video Link:</span>{' '}
//                   <span className="text-gray-900">{formData.huddle01Link}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 1:
//         return renderSessionInfo()
//       case 2:
//         return renderAccessSetup()
//       case 3:
//         return renderPOAPSetup()
//       case 4:
//         return renderReview()
//       default:
//         return renderSessionInfo()
//     }
//   }

//   useEffect(() => {
//     if (open && existingSession) {
//       setFormData({
//         title: existingSession.title || "",
//         description: existingSession.description || "",
//         sessionType: existingSession.sessionType || "Web3 Education",
//         date: existingSession.date || "March, 4th, 2025",
//         startTime: existingSession.startTime || "10:40 am",
//         endTime: existingSession.endTime || "11:40 am",
//         duration: existingSession.duration || "60 mins",
//         timezone: existingSession.timezone || "(GMT+01:00) Central European Standard Time",
//         accessType: existingSession.accessType || "Public",
//         maxParticipants: existingSession.maxParticipants || "100",
//         proofOfAttendance: existingSession.proofOfAttendance ?? true,
//         claimMethod: existingSession.claimMethod || "Auto-mint",
//         nftTitle: existingSession.nftTitle || "",
//         claimOpens: existingSession.claimOpens || "",
//         claimCloses: existingSession.claimCloses || "",
//         attendanceRequirement: existingSession.attendanceRequirement || "30 mins",
//         unlockEventLink: existingSession.unlockEventLink || "",
//         huddle01Link: existingSession.huddle01Link || "",
//       })
//     }
//   }, [open, existingSession])

//   return (
//     <>
//       {renderNotification()}
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
//           {/* Header with DialogTitle */}
//           <div className="flex items-center justify-between p-6 pb-0">
//             <DialogTitle className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Session' : 'Create New Session'}</DialogTitle>
//           </div>

//           {/* Step Indicator */}
//           {renderStepIndicator()}

//           {/* Step Content */}
//           {renderCurrentStep()}

//           {/* Footer */}
//           <div className="flex items-center justify-between p-6 pt-2 border-t">
//             <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="bg-transparent">
//               Back
//             </Button>

//             <div className="flex gap-3">
//               <Button variant="outline" className="bg-transparent" onClick={currentStep === 4 ? handleSaveDraft : handleNext} disabled={isSubmitting}>
//                 Save Draft
//               </Button>
//               <Button
//                 onClick={currentStep === 4 ? handleGoLive : handleNext}
//                 className={`${isBetaTester ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
//                 disabled={!isBetaTester || isSubmitting}
//               >
//                 {isSubmitting ? (
//                   'Creating...'
//                 ) : currentStep === 4 ? (
//                   isBetaTester ? (mode === 'edit' ? 'Update & Unlock As Beta Tester' : 'Unlock As Beta Tester') : 'Unlock As Beta Tester'
//                 ) : (
//                   'Continue'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Calendar, Clock, Globe, Award, Info, CheckCircle, AlertCircle } from "lucide-react"
import { useAppSelector } from '@/redux/store';

interface CreateSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingSession?: any
  mode?: 'create' | 'edit'
  onSaved?: (session: any) => void
}

interface NotificationState {
  show: boolean
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
}

export default function CreateSessionModal({ open, onOpenChange, existingSession, mode = 'create', onSaved }: CreateSessionModalProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sessionType: "Web3 Education",
    date: "March, 4th, 2025",
    startTime: "10:40 am",
    endTime: "11:40 am",
    duration: "60 mins",
    timezone: "(GMT+01:00) Central European Standard Time",
    accessType: "Public",
    maxParticipants: "100",
    proofOfAttendance: true,
    claimMethod: "Auto-mint",
    nftTitle: "",
    claimOpens: "",
    claimCloses: "",
    attendanceRequirement: "30 mins",
    unlockEventLink: "",
    huddle01Link: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const user = useAppSelector((state) => state.authV2.user);
  // const isBetaTester = user?.email === 'kara@si3.space';
  const isBetaTester = user?.email === 'codingfectum@gmail.com' || 'kara@si3.space' || 'imhaseeb8@gmail.com' //'shayanabbasi006@gmail.com';
  console.log("User email:", user?.email, "Is beta tester:", isBetaTester);
  
  // Populate form data when editing existing session
  useEffect(() => {
    if (mode === 'edit' && existingSession && open) {
      setFormData({
        title: existingSession.title || "",
        description: existingSession.description || "",
        sessionType: existingSession.sessionType || "Web3 Education",
        date: existingSession.date || "March, 4th, 2025",
        startTime: existingSession.startTime || "10:40 am",
        endTime: existingSession.endTime || "11:40 am",
        duration: existingSession.duration || "60 mins",
        timezone: existingSession.timezone || "(GMT+01:00) Central European Standard Time",
        accessType: existingSession.accessType || "Public",
        maxParticipants: existingSession.maxParticipants || "100",
        proofOfAttendance: existingSession.proofOfAttendance ?? true,
        claimMethod: existingSession.claimMethod || "Auto-mint",
        nftTitle: existingSession.nftTitle || "",
        claimOpens: existingSession.claimOpens || "",
        claimCloses: existingSession.claimCloses || "",
        attendanceRequirement: existingSession.attendanceRequirement || "30 mins",
        unlockEventLink: existingSession.unlockEventLink || "",
        huddle01Link: existingSession.huddle01Link || "",
      });
    } else if (mode === 'create' && open) {
      // Reset form for new session
      setFormData({
        title: "",
        description: "",
        sessionType: "Web3 Education",
        date: "March, 4th, 2025",
        startTime: "10:40 am",
        endTime: "11:40 am",
        duration: "60 mins",
        timezone: "(GMT+01:00) Central European Standard Time",
        accessType: "Public",
        maxParticipants: "100",
        proofOfAttendance: true,
        claimMethod: "Auto-mint",
        nftTitle: "",
        claimOpens: "",
        claimCloses: "",
        attendanceRequirement: "30 mins",
        unlockEventLink: "",
        huddle01Link: "",
      });
    }
  }, [mode, existingSession, open]);

  const steps = [
    { number: 1, title: "Session Info", active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: "Access Setup", active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: "POAP Setup", active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: "Review", active: currentStep === 4, completed: false },
  ]

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setNotification({ show: true, type, title, message })
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 5000)
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setNotification(prev => ({ ...prev, show: false }))
    onOpenChange(false)
  }

  const handleSaveDraft = async () => {
    if (!isBetaTester) {
      showNotification(
        'warning',
        'Beta Access Required',
        'Only beta testers can create live sessions at this time.'
      )
      return
    }

    setIsSubmitting(true)
    try {
      const baseData = {
        ...formData,
        accessType: 'draft',
        ...(mode === 'create' && {
          creator: user?.id,
        })
      }

      let response;
      if (mode === 'edit' && existingSession?._id) {
        response = await fetch(`/api/siher-live/${existingSession._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(baseData)
        });
      } else {
        response = await fetch('/api/siher-live', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(baseData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save session');
      }

      const result = await response.json();

      showNotification(
        'success',
        mode === 'edit' ? 'Draft Updated' : 'Draft Saved',
        mode === 'edit' ? 'Your session draft has been updated.' : 'Your session has been saved as draft.'
      )

      setTimeout(() => {
        onOpenChange(false)
        setCurrentStep(1)
        setFormData({
          title: "",
          description: "",
          sessionType: "Web3 Education",
          date: "March, 4th, 2025",
          startTime: "10:40 am",
          endTime: "11:40 am",
          duration: "60 mins",
          timezone: "(GMT+01:00) Central European Standard Time",
          accessType: "Public",
          maxParticipants: "100",
          proofOfAttendance: true,
          claimMethod: "Auto-mint",
          nftTitle: "",
          claimOpens: "",
          claimCloses: "",
          attendanceRequirement: "30 mins",
          unlockEventLink: "",
          huddle01Link: "",
        })
        onSaved?.(result.data)
      }, 2000)
    } catch (error) {
      console.error("Error saving draft:", error)
      showNotification(
        'error',
        'Error',
        'Failed to save draft. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoLive = async () => {
    if (!isBetaTester) {
      showNotification(
        'warning',
        'Beta Access Required',
        'Only beta testers can create live sessions at this time.'
      )
      return
    }

    setIsSubmitting(true)
    try {
      const baseData = {
        ...formData,
        accessType: 'public',
        ...(mode === 'create' && {
          creator: user?.id,
        })
      }

      let response;
      if (mode === 'edit' && existingSession?._id) {
        response = await fetch(`/api/siher-live/${existingSession._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(baseData)
        });
      } else {
        response = await fetch('/api/siher-live', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(baseData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save session');
      }

      const result = await response.json();

      showNotification(
        'success',
        mode === 'edit' ? 'Session Updated' : 'Session Created',
        mode === 'edit' ? 'Your session has been updated successfully!' : 'Your live session has been created successfully!'
      )

      // Close the modal and reset the form after a brief delay
      setTimeout(() => {
        onOpenChange(false)
        setCurrentStep(1)
        setFormData({
          title: "",
          description: "",
          sessionType: "Web3 Education",
          date: "March, 4th, 2025",
          startTime: "10:40 am",
          endTime: "11:40 am",
          duration: "60 mins",
          timezone: "(GMT+01:00) Central European Standard Time",
          accessType: "Public",
          maxParticipants: "100",
          proofOfAttendance: true,
          claimMethod: "Auto-mint",
          nftTitle: "",
          claimOpens: "",
          claimCloses: "",
          attendanceRequirement: "30 mins",
          unlockEventLink: "",
          huddle01Link: "",
        })
        onSaved?.(result.data)
      }, 2000)
    } catch (error) {
      console.error("Error creating session:", error)
      showNotification(
        'error',
        'Error',
        'Failed to create session. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderNotification = () => {
    if (!notification.show) return null

    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Alert className={`border-l-4 ${notification.type === 'success' ? 'border-l-green-500 bg-green-50' :
          notification.type === 'error' ? 'border-l-red-500 bg-red-50' :
            'border-l-yellow-500 bg-yellow-50'
          }`}>
          <div className="flex items-start gap-3">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
            {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />}
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                  'text-yellow-800'
                }`}>
                {notification.title}
              </h4>
              <AlertDescription className={`text-sm ${notification.type === 'success' ? 'text-green-700' :
                notification.type === 'error' ? 'text-red-700' :
                  'text-yellow-700'
                }`}>
                {notification.message}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Alert>
      </div>
    )
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.completed
                ? "bg-purple-600 text-white"
                : step.active
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-500"
                }`}
            >
              {step.number}
            </div>
            <span className={`text-xs mt-1 ${step.active ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-px mx-4 ${step.completed ? "bg-purple-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderSessionInfo = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-900">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Session Title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-900">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Session description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">Session Type</Label>
            <Select
              value={formData.sessionType}
              onValueChange={(value) => setFormData({ ...formData, sessionType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web3 Education">Web3 Education</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="BTS (Behind-the-Scenes)">BTS (Behind-the-Scenes)</SelectItem>
                <SelectItem value="Lifestyle Show">Lifestyle Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="text-sm font-medium text-gray-900">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-900">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">Duration</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 mins">30 mins</SelectItem>
                <SelectItem value="60 mins">60 mins</SelectItem>
                <SelectItem value="90 mins">90 mins</SelectItem>
                <SelectItem value="120 mins">120 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          <Label className="text-sm font-medium text-gray-900">Time Zone</Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => setFormData({ ...formData, timezone: value })}
          >
            <SelectTrigger className="mt-1 text-left">
              <Globe className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <div className="sticky top-0 bg-background z-10 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                Common Time Zones
              </div>
              {[
                { value: '(GMT+00:00) Greenwich Mean Time', label: 'Greenwich Mean Time (GMT)' },
                { value: '(GMT-05:00) Eastern Standard Time', label: 'Eastern Time (ET)' },
                { value: '(GMT-06:00) Central Standard Time', label: 'Central Time (CT)' },
                { value: '(GMT-08:00) Pacific Standard Time', label: 'Pacific Time (PT)' },
                { value: '(GMT+01:00) Central European Standard Time', label: 'Central European Time (CET)' },
                { value: '(GMT+05:30) India Standard Time', label: 'India Standard Time (IST)' },
                { value: '(GMT+08:00) China Standard Time', label: 'China Standard Time (CST)' },
                { value: '(GMT+09:00) Japan Standard Time', label: 'Japan Standard Time (JST)' },
                { value: '(GMT+10:00) Australian Eastern Standard Time', label: 'Australian Eastern Time (AET)' },
              ].map((zone) => (
                <SelectItem key={zone.value} value={zone.value}>
                  <div className="flex items-center">
                    <span className="font-medium">{zone.label.split(' (')[0]}</span>
                    <span className="ml-2 text-muted-foreground">
                      {zone.value.split(') ')[0]})
                    </span>
                  </div>
                </SelectItem>
              ))}

              <div className="sticky top-0 bg-background z-10 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-t">
                All Time Zones
              </div>

              {[
                '(GMT-12:00) International Date Line West',
                '(GMT-11:00) Midway Island, Samoa',
                '(GMT-10:00) Hawaii',
                '(GMT-09:00) Alaska',
                '(GMT-08:00) Pacific Time (US & Canada)',
                '(GMT-07:00) Arizona',
                '(GMT-07:00) Mountain Time (US & Canada)',
                '(GMT-06:00) Central America',
                '(GMT-06:00) Central Time (US & Canada)',
                '(GMT-06:00) Mexico City',
                '(GMT-06:00) Saskatchewan',
                '(GMT-05:00) Bogota, Lima, Quito',
                '(GMT-05:00) Eastern Time (US & Canada)',
                '(GMT-05:00) Indiana (East)',
                '(GMT-04:30) Caracas',
                '(GMT-04:00) Asuncion',
                '(GMT-04:00) Atlantic Time (Canada)',
                '(GMT-04:00) Georgetown, La Paz, Manaus',
                '(GMT-04:00) Santiago',
                '(GMT-03:30) Newfoundland',
                '(GMT-03:00) Brasilia',
                '(GMT-03:00) Buenos Aires',
                '(GMT-03:00) Greenland',
                '(GMT-03:00) Montevideo',
                '(GMT-02:00) Mid-Atlantic',
                '(GMT-01:00) Azores',
                '(GMT-01:00) Cape Verde Is.',
                '(GMT+00:00) Casablanca',
                '(GMT+00:00) Dublin, Edinburgh, Lisbon, London',
                '(GMT+00:00) Monrovia, Reykjavik',
                '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
                '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
                '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
                '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
                '(GMT+01:00) West Central Africa',
                '(GMT+02:00) Amman',
                '(GMT+02:00) Athens, Bucharest',
                '(GMT+02:00) Beirut',
                '(GMT+02:00) Cairo',
                '(GMT+02:00) Chisinau',
                '(GMT+02:00) Damascus',
                '(GMT+02:00) Harare, Pretoria',
                '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
                '(GMT+02:00) Jerusalem',
                '(GMT+02:00) Windhoek',
                '(GMT+03:00) Baghdad',
                '(GMT+03:00) Kuwait, Riyadh',
                '(GMT+03:00) Minsk',
                '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
                '(GMT+03:00) Nairobi',
                '(GMT+03:30) Tehran',
                '(GMT+04:00) Abu Dhabi, Muscat',
                '(GMT+04:00) Baku',
                '(GMT+04:00) Tbilisi',
                '(GMT+04:00) Yerevan',
                '(GMT+04:30) Kabul',
                '(GMT+05:00) Islamabad, Karachi',
                '(GMT+05:00) Tashkent',
                '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                '(GMT+05:45) Kathmandu',
                '(GMT+06:00) Astana',
                '(GMT+06:00) Dhaka',
                '(GMT+06:30) Yangon (Rangoon)',
                '(GMT+07:00) Bangkok, Hanoi, Jakarta',
                '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
                '(GMT+08:00) Kuala Lumpur, Singapore',
                '(GMT+08:00) Perth',
                '(GMT+08:00) Taipei',
                '(GMT+09:00) Osaka, Sapporo, Tokyo',
                '(GMT+09:00) Seoul',
                '(GMT+09:30) Adelaide',
                '(GMT+09:30) Darwin',
                '(GMT+10:00) Brisbane',
                '(GMT+10:00) Canberra, Melbourne, Sydney',
                '(GMT+10:00) Guam, Port Moresby',
                '(GMT+10:00) Hobart',
                '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
                '(GMT+12:00) Auckland, Wellington',
                '(GMT+12:00) Fiji',
                '(GMT+13:00) Nuku\'alofa',
              ].map((timezone) => (
                <SelectItem key={timezone} value={timezone} className="py-2">
                  <div className="flex items-center">
                    <span className="font-medium">{timezone.split(') ')[1]}</span>
                    <span className="ml-2 text-muted-foreground">
                      {timezone.split(') ')[0]})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderAccessSetup = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">Access Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {["Public", "Token-Gated", "Private"].map((type) => (
              <Button
                key={type}
                variant={formData.accessType === type ? "default" : "outline"}
                className={`${formData.accessType === type
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                onClick={() => setFormData({ ...formData, accessType: type })}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className="text-sm font-medium text-gray-900">Max Participant</Label>
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">(Optional)</span>
          </div>
          <Input
            placeholder="Set max capacity..."
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )

  const renderPOAPSetup = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-900">Enable Proof of Attendance</span>
          </div>
          <Switch
            checked={formData.proofOfAttendance}
            onCheckedChange={(checked) => setFormData({ ...formData, proofOfAttendance: checked })}
          />
        </div>

        <p className="text-sm text-gray-600 -mt-2">
          Automatically reward attendees with a collectible badge for joining this session.
        </p>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className="text-sm font-medium text-gray-900">Claim Method</Label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <Select
            value={formData.claimMethod}
            onValueChange={(value) => setFormData({ ...formData, claimMethod: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Auto-mint">Auto-mint</SelectItem>
              <SelectItem value="Manual-claim">Manual-claim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900">Unlock NFT Event Link</Label>
          <Input
            placeholder="https://app.unlock-protocol.com/locks/..."
            value={formData.unlockEventLink || ''}
            onChange={(e) => setFormData({ ...formData, unlockEventLink: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900">Huddle01 Video Link</Label>
          <Input
            placeholder="https://huddle01.com/..."
            value={formData.huddle01Link || ''}
            onChange={(e) => setFormData({ ...formData, huddle01Link: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="claimOpens" className="text-sm font-medium text-gray-900">Claim Opens</Label>
            <Input
              id="claimOpens"
              type="date"
              value={formData.claimOpens}
              onChange={(e) => setFormData({ ...formData, claimOpens: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="claimCloses" className="text-sm font-medium text-gray-900">Claim Closes</Label>
            <Input
              id="claimCloses"
              type="date"
              value={formData.claimCloses}
              onChange={(e) => setFormData({ ...formData, claimCloses: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className="text-sm font-medium text-gray-900">Attendance Requirement</Label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <Select
            value={formData.attendanceRequirement}
            onValueChange={(value) => setFormData({ ...formData, attendanceRequirement: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 mins">15 mins</SelectItem>
              <SelectItem value="30 mins">30 mins</SelectItem>
              <SelectItem value="45 mins">45 mins</SelectItem>
              <SelectItem value="60 mins">60 mins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderReview = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Session Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Session Info</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Title:</span>{' '}
              <span className="text-gray-900">{formData.title || 'Not specified'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Description:</span>{' '}
              <span className="text-gray-900">{formData.description || 'Not specified'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Type:</span>{' '}
              <span className="text-gray-900">{formData.sessionType}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Date & Time:</span>{' '}
              <span className="text-gray-900">
                {formData.date} • {formData.startTime} - {formData.endTime} ({formData.timezone})
              </span>
            </div>
          </div>
        </div>

        {/* Access Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Access</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Access Type:</span>{' '}
              <span className="text-gray-900">{formData.accessType}</span>
            </div>
            {formData.accessType === 'Public' && formData.maxParticipants && (
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Max Participants:</span>{' '}
                <span className="text-gray-900">{formData.maxParticipants}</span>
              </div>
            )}
          </div>
        </div>

        {/* Proof of Attendance Summary */}
        {formData.proofOfAttendance && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Proof of Attendance</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Status:</span>{' '}
                <span className="text-gray-900">Enabled</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Claim Method:</span>{' '}
                <span className="text-gray-900">{formData.claimMethod}</span>
              </div>
              {formData.nftTitle && (
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Session Title:</span>{' '}
                  <span className="text-gray-900">{formData.nftTitle}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Attendance Requirement:</span>{' '}
                <span className="text-gray-900">{formData.attendanceRequirement}</span>
              </div>
              {(formData.claimOpens || formData.claimCloses) && (
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Claim Period:</span>{' '}
                  <span className="text-gray-900">
                    {formData.claimOpens || 'Not specified'} to {formData.claimCloses || 'Not specified'}
                  </span>
                </div>
              )}
              {formData.unlockEventLink && (
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Unlock NFT Event Link:</span>{' '}
                  <span className="text-gray-900">{formData.unlockEventLink}</span>
                </div>
              )}
              {formData.huddle01Link && (
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Huddle01 Video Link:</span>{' '}
                  <span className="text-gray-900">{formData.huddle01Link}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderSessionInfo()
      case 2:
        return renderAccessSetup()
      case 3:
        return renderPOAPSetup()
      case 4:
        return renderReview()
      default:
        return renderSessionInfo()
    }
  }

  useEffect(() => {
    if (open && existingSession) {
      setFormData({
        title: existingSession.title || "",
        description: existingSession.description || "",
        sessionType: existingSession.sessionType || "Web3 Education",
        date: existingSession.date || "March, 4th, 2025",
        startTime: existingSession.startTime || "10:40 am",
        endTime: existingSession.endTime || "11:40 am",
        duration: existingSession.duration || "60 mins",
        timezone: existingSession.timezone || "(GMT+01:00) Central European Standard Time",
        accessType: existingSession.accessType || "Public",
        maxParticipants: existingSession.maxParticipants || "100",
        proofOfAttendance: existingSession.proofOfAttendance ?? true,
        claimMethod: existingSession.claimMethod || "Auto-mint",
        nftTitle: existingSession.nftTitle || "",
        claimOpens: existingSession.claimOpens || "",
        claimCloses: existingSession.claimCloses || "",
        attendanceRequirement: existingSession.attendanceRequirement || "30 mins",
        unlockEventLink: existingSession.unlockEventLink || "",
        huddle01Link: existingSession.huddle01Link || "",
      })
    }
  }, [open, existingSession])

  return (
    <>
      {renderNotification()}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {/* Header with DialogTitle */}
          <div className="flex items-center justify-between p-6 pb-0">
            <DialogTitle className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Session' : 'Create New Session'}</DialogTitle>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 pt-2 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="bg-transparent">
              Back
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" className="bg-transparent" onClick={currentStep === 4 ? handleSaveDraft : handleNext} disabled={isSubmitting}>
                Save Draft
              </Button>
              <Button
                onClick={currentStep === 4 ? handleGoLive : handleNext}
                className={`${isBetaTester ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!isBetaTester || isSubmitting}
              >
                {isSubmitting ? (
                  'Creating...'
                ) : currentStep === 4 ? (
                  isBetaTester ? (mode === 'edit' ? 'Update & Unlock As Beta Tester' : 'Unlock As Beta Tester') : 'Unlock As Beta Tester'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}