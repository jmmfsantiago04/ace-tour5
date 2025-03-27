'use server'

import { createFAQ as _createFAQ } from './admin/createFAQ'
import { createMiceCard as _createMiceCard } from './admin/createMiceCard'
import { createReview as _createReview } from './admin/createReview'
import { getFAQs as _getFAQs } from './admin/getFAQs'
import { getMiceCards as _getMiceCards } from './admin/getMiceCards'
import { getReviews as _getReviews } from './admin/getReviews'
import { updateFAQ as _updateFAQ } from './admin/updateFAQ'
import { updateMiceCard as _updateMiceCard } from './admin/updateMiceCard'
import { updateReview as _updateReview } from './admin/updateReview'
import { deleteItem as _deleteItem } from './admin/deleteItem'
import { 
  getSupportInquiries as _getSupportInquiries,
  updateInquiryStatus as _updateInquiryStatus 
} from './admin/supportInquiries'

export const createFAQ = _createFAQ
export const createMiceCard = _createMiceCard
export const createReview = _createReview
export const getFAQs = _getFAQs
export const getMiceCards = _getMiceCards
export const getReviews = _getReviews
export const updateFAQ = _updateFAQ
export const updateMiceCard = _updateMiceCard
export const updateReview = _updateReview
export const deleteItem = _deleteItem
export const getSupportInquiries = _getSupportInquiries
export const updateInquiryStatus = _updateInquiryStatus 