import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../context/StoreContext'

const ExploreMenu = ({ category, setCategory }) => {

  const { category_list } = useContext(StoreContext)

  return (
    <div className='explore-menu' id='explore-menu'>

      <div className='explore-menu-header'>

        <h2>🥡 Explore our foods</h2>
        <p className='explore-menu-text'>Choose the desired category that you love to eat.</p>

        <div className='explore-menu-list'>
          {category_list.map((item, index) => {
            return (
              <div onClick={() => setCategory(prev => prev === item.name ? "All" : item.name)} key={index} className='explore-menu-list-item'>
                <img className={category === item.name ? "active" : ""} src={item.image} alt='' />
                <p>{item.name}</p>
              </div>
            )
          })}
        </div>

      </div>

      <hr />

    </div>
  )
}

export default ExploreMenu
