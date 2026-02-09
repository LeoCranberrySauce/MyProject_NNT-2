import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    // Dynamically set the URL based on the current host
    const url = `http://${window.location.hostname}:4000`;
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [category_list, setCategoryList] = useState([])
    
    // GPS and Location states
    const [userLocation, setUserLocation] = useState(null);
    const [restaurantLocations, setRestaurantLocations] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [orderDeliveryLocation, setOrderDeliveryLocation] = useState(null);
    const [locationPermission, setLocationPermission] = useState(false);

    const addToCart = async (itemId, quantityToAdd = 1) => {
        const item = food_list.find((product) => product._id === itemId);
        if (!item) return;

        // Check if we can add the requested quantity based on stock
        const currentQuantity = cartItems[itemId] || 0;
        if (currentQuantity + quantityToAdd > item.stock) {
            return; // Can't add more items than available stock
        }

        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: quantityToAdd }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + quantityToAdd }))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId, quantity: quantityToAdd},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        if (!cartItems[itemId] || cartItems[itemId] <= 0) return;
        
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }

    const fetchCategoryList = async () => {
        const response = await axios.get(url + "/api/category/cat-list");
        setCategoryList(response.data.data);
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    // Get user's current GPS location
    const getUserLocation = async () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            name: "My Location",
                        };
                        setUserLocation(location);
                        setLocationPermission(true);
                        resolve(location);
                    },
                    (error) => {
                        console.log("Geolocation error:", error);
                        setLocationPermission(false);
                        reject(error);
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                reject(new Error("Geolocation not supported"));
            }
        });
    };

    // Fetch nearby restaurants
    const fetchNearbyRestaurants = async (latitude, longitude, radius = 5) => {
        try {
            const response = await axios.post(url + "/api/location/nearby", {
                latitude,
                longitude,
                radius,
            });
            if (response.data.success) {
                const formattedLocations = response.data.data.map((location) => ({
                    lat: location.latitude,
                    lng: location.longitude,
                    name: location.name,
                    address: location.address,
                    rating: location.rating,
                    deliveryTime: location.deliveryTime,
                }));
                setRestaurantLocations(formattedLocations);
                return formattedLocations;
            }
        } catch (error) {
            console.log("Error fetching nearby restaurants:", error);
        }
    };

    // Fetch all restaurant locations
    const fetchRestaurantLocations = async () => {
        try {
            const response = await axios.get(url + "/api/location/restaurants");
            if (response.data.success) {
                const formattedLocations = response.data.data.map((location) => ({
                    lat: location.latitude,
                    lng: location.longitude,
                    name: location.name,
                    address: location.address,
                    rating: location.rating,
                    deliveryTime: location.deliveryTime,
                }));
                setRestaurantLocations(formattedLocations);
                return formattedLocations;
            }
        } catch (error) {
            console.log("Error fetching restaurant locations:", error);
        }
    };

    // Save delivery address with GPS coordinates
    const saveDeliveryAddress = async (address, latitude, longitude) => {
        try {
            const deliveryData = {
                address,
                lat: latitude,
                lng: longitude,
            };
            setDeliveryAddress(deliveryData);
            
            if (token) {
                await axios.post(
                    url + "/api/location/save-location",
                    {
                        name: "Delivery Address",
                        address,
                        latitude,
                        longitude,
                    },
                    { headers: { token } }
                );
            }
            return deliveryData;
        } catch (error) {
            console.log("Error saving delivery address:", error);
        }
    };

    // Get delivery tracking location
    const getDeliveryLocation = async (orderId) => {
        try {
            const response = await axios.post(url + "/api/location/delivery-location", {
                orderId,
            });
            if (response.data.success) {
                const location = {
                    lat: response.data.data.latitude,
                    lng: response.data.data.longitude,
                    name: response.data.data.name,
                };
                setOrderDeliveryLocation(location);
                return location;
            }
        } catch (error) {
            console.log("Error fetching delivery location:", error);
        }
    };

    // Update delivery location (for live tracking)
    const updateDeliveryLocation = async (orderId, latitude, longitude) => {
        try {
            const response = await axios.post(url + "/api/location/update-delivery", {
                orderId,
                latitude,
                longitude,
            });
            if (response.data.success) {
                const location = {
                    lat: response.data.data.latitude,
                    lng: response.data.data.longitude,
                    name: response.data.data.name,
                };
                setOrderDeliveryLocation(location);
                return location;
            }
        } catch (error) {
            console.log("Error updating delivery location:", error);
        }
    };

    useEffect(() => {
        async function loadData(){
            await fetchFoodList();
            await fetchRestaurantLocations();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"))
            }
            await fetchCategoryList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData();
    }, [])

    const ContextValue = {
        food_list,
        category_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        // Location/GPS methods and states
        userLocation,
        setUserLocation,
        restaurantLocations,
        setRestaurantLocations,
        selectedRestaurant,
        setSelectedRestaurant,
        deliveryAddress,
        setDeliveryAddress,
        orderDeliveryLocation,
        setOrderDeliveryLocation,
        locationPermission,
        getUserLocation,
        fetchNearbyRestaurants,
        fetchRestaurantLocations,
        saveDeliveryAddress,
        getDeliveryLocation,
        updateDeliveryLocation,
    }


    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;