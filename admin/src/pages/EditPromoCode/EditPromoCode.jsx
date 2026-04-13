import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './EditPromoCode.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

const EditPromoCode = ({ setEditPromoCode, promoCodeToEdit, url }) => {
  const [loading, setLoading] = useState(false)
  const baseURL = url

  const [data, setData] = useState({
    name: "",
    description: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    expiresAt: "",
    usageLimit: ""
  })

  useEffect(() => {
    if (promoCodeToEdit) {
      setData({
        name: promoCodeToEdit.name,
        description: promoCodeToEdit.description,
        code: promoCodeToEdit.code,
        discountType: promoCodeToEdit.discountType,
        discountValue: promoCodeToEdit.discountValue.toString(),
        minOrderAmount: promoCodeToEdit.minOrderAmount.toString(),
        maxDiscount: promoCodeToEdit.maxDiscount ? promoCodeToEdit.maxDiscount.toString() : "",
        expiresAt: promoCodeToEdit.expiresAt ? new Date(promoCodeToEdit.expiresAt).toISOString().slice(0, 16) : "",
        usageLimit: promoCodeToEdit.usageLimit ? promoCodeToEdit.usageLimit.toString() : ""
      })
    }
  }, [promoCodeToEdit])

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const formatCurrency = (value) => {
    return `PHP ${parseFloat(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDiscount = (type, value) => {
    if (type === 'percentage') {
      return `${value}%`
    } else {
      return formatCurrency(value)
    }
  }

  // Helper function to get auth headers (same as PromoCodes component)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { token: token } : {};
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    // Validation
    if (!data.discountValue || !data.expiresAt) {
      toast.error("Please fill in all required fields")
      return
    }

    if (data.discountValue <= 0) {
      toast.error("Discount value must be greater than 0")
      return
    }

    if (data.minOrderAmount < 0) {
      toast.error("Minimum order amount cannot be negative")
      return
    }

    if (data.maxDiscount && data.maxDiscount <= 0) {
      toast.error("Maximum discount must be greater than 0")
      return
    }

    if (data.usageLimit && data.usageLimit <= 0) {
      toast.error("Usage limit must be greater than 0")
      return
    }

    const expiresAt = new Date(data.expiresAt)
    const now = new Date()
    if (expiresAt <= now) {
      toast.error("Expiration date must be in the future")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${baseURL}/api/promo-code/update`, {
        ...data,
        discountValue: Number(data.discountValue),
        minOrderAmount: Number(data.minOrderAmount),
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
        expiresAt: expiresAt
      }, {
        headers: getAuthHeaders()
      })

      if (response.data.success) {
        toast.success("Promo code updated successfully")
        setEditPromoCode(false)
        // Note: The backend will handle updating by checking if the code already exists
      } else {
        toast.error(response.data.message || "Failed to update promo code")
      }
    } catch (error) {
      console.error("Error updating promo code:", error)
      toast.error(error.response?.data?.message || "Error updating promo code")
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setEditPromoCode(false)
  }

  if (!promoCodeToEdit) return null

  return (
    <div className="edit-promo-code-overlay" onClick={closeModal}>
      <div className="edit-promo-code-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-promo-code-header">
          <h2>Edit Promo Code</h2>
          <button className="close-btn" onClick={closeModal}>
            <img src={assets.cross_icon} alt="Close" />
          </button>
        </div>

        <div className="current-promo-info">
          <h3>Current Promo Code Details</h3>
          <div className="info-grid-name">
            <span className="label">Name:</span>
            <span className="value">{promoCodeToEdit.name}</span>
          </div>
          <div className="info-grid-description">
            <span className="label">Description:</span>
            <span className="value">{promoCodeToEdit.description}</span>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Code:</span>
              <span className="value code-value">{promoCodeToEdit.code}</span>
            </div>
            <div className="info-item">
              <span className="label">Type:</span>
              <span className="value">{promoCodeToEdit.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</span>
            </div>
            <div className="info-item">
              <span className="label">Discount:</span>
              <span className="value">{formatDiscount(promoCodeToEdit.discountType, promoCodeToEdit.discountValue)}</span>
            </div>
            <div className="info-item">
              <span className="label">Min Order:</span>
              <span className="value">{formatCurrency(promoCodeToEdit.minOrderAmount)}</span>
            </div>
            <div className="info-item">
              <span className="label">Max Discount:</span>
              <span className="value">{promoCodeToEdit.maxDiscount ? formatCurrency(promoCodeToEdit.maxDiscount) : 'No Limit'}</span>
            </div>
            <div className="info-item">
              <span className="label">Usage:</span>
              <span className="value">{promoCodeToEdit.usedCount}{promoCodeToEdit.usageLimit ? ` / ${promoCodeToEdit.usageLimit}` : ' / Unlimited'}</span>
            </div>
            <div className="info-item">
              <span className="label">Expires:</span>
              <span className="value">{new Date(promoCodeToEdit.expiresAt).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`value status ${promoCodeToEdit.isActive ? 'active' : 'inactive'}`}>
                {promoCodeToEdit.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <form className="edit-form" onSubmit={onSubmitHandler}>
          <h3>Update Promo Code</h3>

          <div className='promo-code-name'>
              <p>Name</p>
              <input
                onChange={onChangeHandler}
                value={data.name}
                type='text'
                name='name'
                placeholder='Enter promo code name'
              />
          </div>

          <div className='promo-code-description'>
              <p>Description</p>
              <textarea
                onChange={onChangeHandler}
                value={data.description}
                name='description'
                placeholder='Enter promo code description'
                rows='4'
              />
          </div>

          <div className='edit-discount-type-value'>
            <div className="edit-discount-type">
              <p>Discount Type</p>
              <select onChange={onChangeHandler} name='discountType' value={data.discountType}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (PHP)</option>
              </select>
            </div>
            <div className="edit-discount-value">  
              <p>Discount Value</p>
              <input
                onChange={onChangeHandler}
                value={data.discountValue}
                type='number'
                name='discountValue'
                placeholder={data.discountType === 'percentage' ? 'Enter percentage (e.g., 10)' : 'Enter amount (e.g., 50)'}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className='edit-promo-code-details'>
            <div className="edit-min-order">
              <p>Minimum Order Amount (PHP)</p>
              <input
                onChange={onChangeHandler}
                value={data.minOrderAmount}
                type='number'
                name='minOrderAmount'
                placeholder='0'
                min="0"
                step="0.01"
              />
            </div>
            <div className="edit-max-discount">
              <p>Maximum Discount (PHP) <span className="edit-optional">(Optional)</span></p>
              <input
                onChange={onChangeHandler}
                value={data.maxDiscount}
                type='number'
                name='maxDiscount'
                placeholder='No limit'
                min="0"
                step="0.01"
              />
              <small className="helper-text">Only applies to percentage discounts</small>
            </div>
          </div>

          <div className='edit-usage-expiry'>
            <div className="edit-usage-limit">
              <p>Usage Limit <span className="edit-optional">(Optional)</span></p>
              <input
                onChange={onChangeHandler}
                value={data.usageLimit}
                type='number'
                name='usageLimit'
                placeholder='Unlimited'
                min="1"
              />
              <small className="helper-text">Maximum number of times this code can be used</small>
            </div>
            <div className="edit-expiry-date">
              <p>Expiration Date</p>
              <input
                onChange={onChangeHandler}
                value={data.expiresAt}
                type='datetime-local'
                name='expiresAt'
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type='button' className='cancel-btn' onClick={closeModal}>
              Cancel
            </button>
            <button type='submit' className='save-btn' disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPromoCode