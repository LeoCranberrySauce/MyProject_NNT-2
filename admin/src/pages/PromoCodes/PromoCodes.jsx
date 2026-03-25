import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './PromoCodes.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

const PromoCodes = ({ url, setEditPromoCode, setPromoCodeToEdit }) => {
  const { isAuthenticated } = useAuth();

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { token: token } : {};
  };

  // Add Promo Code Form State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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

  // Promo Codes List State
  const [promoCodes, setPromoCodes] = useState([])
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const generatePromoCode = () => {
    setIsGeneratingCode(true)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setData(prev => ({ ...prev, code: result }))
    setIsGeneratingCode(false)
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

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    // Validation
    if (!data.code || !data.discountValue || !data.expiresAt) {
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
      const response = await axios.post(`${baseURL}/api/promo-code/create`, {
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
        setData({
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
        toast.success("Promo code created successfully")
        fetchPromoCodes()
      } else {
        toast.error(response.data.message || "Failed to create promo code")
      }
    } catch (error) {
      console.error("Error creating promo code:", error)
      toast.error(error.response?.data?.message || "Error creating promo code")
    } finally {
      setLoading(false)
    }
  }

  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${baseURL}/api/promo-code/list`, {
        headers: getAuthHeaders()
      })
      if (response.data.success) {
        setPromoCodes(response.data.data || [])
      } else {
        // Only show error if there's actually an error message
        const errorMessage = response.data.message || "Failed to fetch promo codes"
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching promo codes"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error fetching promo codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const removePromoCode = async (promoCodeId) => {
    if (!window.confirm("Are you sure you want to delete this promo code? This action cannot be undone.")) {
      return
    }

    try {
      const response = await axios.post(`${baseURL}/api/promo-code/delete`, { code: promoCodeId }, {
        headers: getAuthHeaders()
      })
      if (response.data.success) {
        toast.success("Promo code deleted successfully")
        fetchPromoCodes()
      } else {
        toast.error(response.data.message || "Failed to delete promo code")
      }
    } catch (error) {
      console.error("Error deleting promo code:", error)
      toast.error(error.response?.data?.message || "Error deleting promo code")
    }
  }

  const togglePromoCode = async (promoCodeId, currentStatus) => {
    try {
      const response = await axios.post(`${baseURL}/api/promo-code/toggle`, {
        code: promoCodeId,
        isActive: !currentStatus
      }, {
        headers: getAuthHeaders()
      })
      if (response.data.success) {
        const status = !currentStatus ? "activated" : "deactivated"
        toast.success(`Promo code ${status} successfully`)
        fetchPromoCodes()
      } else {
        toast.error(response.data.message || "Failed to update promo code")
      }
    } catch (error) {
      console.error("Error updating promo code:", error)
      toast.error(error.response?.data?.message || "Error updating promo code")
    }
  }

  const handleEdit = (promoCode) => {
    setPromoCodeToEdit(promoCode)
    setEditPromoCode(true)
  }

  const getStatusBadge = (promoCode) => {
    const now = new Date()
    const expiresAt = new Date(promoCode.expiresAt)
    const isExpired = expiresAt < now
    const isInactive = !promoCode.isActive

    if (isExpired) {
      return <span className="status-badge expired">Expired</span>
    } else if (isInactive) {
      return <span className="status-badge inactive">Inactive</span>
    } else {
      return <span className="status-badge active">Active</span>
    }
  }

  const getUsagePercentage = (promoCode) => {
    if (!promoCode.usageLimit) return 0
    return Math.round((promoCode.usedCount / promoCode.usageLimit) * 100)
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  if (error && promoCodes.length === 0) {
    return (
      <div className="promo-codes add flex-col">
        <h1>Promo Code Management</h1>
        <div className="error-message">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className='promo-codes add'>
      <h1>Promo Code Management</h1>

      <div className='promo-codes-container'>

        {/* ADD PROMO CODE - LEFT SIDE */}
        <div className='promo-codes-left'>
          <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-promo-codes">
              <h2>Add Promo Code</h2>

              <div className='promo-code-generation'>
                <p>Promo Name</p>
                <small className="helper-text">Name of the promo code for reference</small>
                <div className="text-input-container">
                  <input
                    onChange={onChangeHandler}
                    value={data.name}
                    type='text'
                    name='name'
                    placeholder='Enter promo name'
                    style={{ flex: 1 }}
                    required
                  />
                </div>
              </div>

              <div className='promo-code-generation'>
                <p>Promo Description</p>
                <small className="helper-text">Put a brief description of the promo code that requires attention</small>
                <div className="description-input-container">
                  <textarea
                    onChange={onChangeHandler}
                    value={data.description}
                    type='text'
                    name='description'
                    placeholder='Enter promo description'
                    style={{ flex: 1 }}
                    rows='4'
                    required
                  />
                </div>
              </div>

              <div className='promo-code-generation'>
                <p>Promo Code</p>
                <small className="helper-text">Auto-generate a unique 8-character promo code or enter your own</small>
                <div className="code-input-container">
                  <input
                    onChange={onChangeHandler}
                    value={data.code}
                    type='text'
                    name='code'
                    placeholder='Enter promo code (e.g., WELCOME10)'
                    style={{ flex: 1 }}
                    required
                  />
                  <button
                    type='button'
                    onClick={generatePromoCode}
                    disabled={isGeneratingCode}
                    className="generate-btn"
                  >
                    {isGeneratingCode ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>

              <div className='discount-type-value'>
                <div className="discount-type">
                  <p>Discount Type</p>
                  <select onChange={onChangeHandler} name='discountType' value={data.discountType}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PHP)</option>
                  </select>
                </div>
                <div className="discount-value">
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

              <div className='promo-code-details'>
                <div className="min-order">
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
                <div className="max-discount">
                  <p>Maximum Discount (PHP) <span className="optional">(Optional)</span></p>
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

              <div className='usage-expiry'>
                <div className="usage-limit">
                  <p>Usage Limit <span className="optional">(Optional)</span></p>
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
                <div className="expiry-date">
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
            </div>
            <button type='submit' className='add-btn' disabled={loading}>
              {loading ? 'Creating...' : 'Create Promo Code'}
            </button>
          </form>
        </div>

        {/* PROMO CODES LIST - RIGHT SIDE */}
        <div className='promo-codes-right'>
          <div className="promo-codes-table">
            <h2>Promo Code List</h2>
            <div className="promo-codes-table-format title">
              <b>Code</b>
              <b>Discount</b>
              <b>Min Order</b>
              <b>Usage</b>
              <b>Expires</b>
              <b>Status</b>
              <b>Action</b>
            </div>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : !promoCodes || promoCodes.length === 0 ? (
              <div className="no-data">No promo codes found</div>
            ) : (
              promoCodes.map((promoCode, index) => (
                <div className="promo-codes-table-format" key={index}>
                  <div className="code-column">
                    <span className="code-value">{promoCode.code}</span>
                    <span className="code-type">{promoCode.discountType === 'percentage' ? 'Percentage' : 'Fixed'}</span>
                  </div>
                  <div className="discount-column">
                    <span className="discount-value">{formatDiscount(promoCode.discountType, promoCode.discountValue)}</span>
                    {promoCode.maxDiscount && (
                      <span className="max-discount">Max: {formatCurrency(promoCode.maxDiscount)}</span>
                    )}
                  </div>
                  <div className="min-order-column">
                    <span>{formatCurrency(promoCode.minOrderAmount)}</span>
                  </div>
                  <div className="usage-column">
                    <div className="usage-info">
                      <span className="usage-count">{promoCode.usedCount}{promoCode.usageLimit ? ` / ${promoCode.usageLimit}` : ''}</span>
                      {promoCode.usageLimit && (
                        <div className="usage-bar">
                          <div
                            className="usage-fill"
                            style={{ width: `${getUsagePercentage(promoCode)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="expiry-column">
                    <span>{new Date(promoCode.expiresAt).toLocaleString()}</span>
                    {new Date(promoCode.expiresAt) < new Date() && (
                      <span className="expired-label">Expired</span>
                    )}
                  </div>
                  <div className="status-column">
                    {getStatusBadge(promoCode)}
                  </div>
                  <div className="promo-codes-table-action">
                    <button
                      onClick={() => handleEdit(promoCode)}
                      className="promo-codes-table-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePromoCode(promoCode.code, promoCode.isActive)}
                      className={`promo-codes-table-toggle ${promoCode.isActive ? 'deactivate' : 'activate'}`}
                    >
                      {promoCode.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => removePromoCode(promoCode.code)}
                      className="promo-codes-table-del"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoCodes