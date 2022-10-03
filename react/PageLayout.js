import React from 'react'
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom";


// This component generates the base layout for this app.
const PageLayout = ({ children }) => (
    <div className="vh-100 flex flex-row">
      <div className="w-100 overflow-y-scroll">
        <div className="mw8 pv8 ph9 wewe">
          {children}
        </div>
      </div>
    </div>
)

export default PageLayout
