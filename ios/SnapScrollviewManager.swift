//
//  SnapScrollViewManager.swift
//  SnapScrollView
//
//  Created by Aurimas on 2020-01-19.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(SnapScrollViewManager)
class SnapScrollviewManager : RCTViewManager {
    override func view() -> UIView? {
        return SnapScrollView(eventDispatcher: self.bridge.eventDispatcher())
  }

    @objc func updateContentOffset(_ node: NSNumber) {
        self.bridge.uiManager.addUIBlock({ uiManager, viewRegistry in
            let view = viewRegistry?[node]
            if (view is RCTScrollView) {
                (view as? RCTScrollView)?.updateContentOffsetIfNeeded()
            } else {
                print("View does not found")
            }
        })
    }

    @objc func scrollTo(_ node: NSNumber, offsetX x: CGFloat, offsetY y: CGFloat, animated: Bool) {
        self.bridge.uiManager.addUIBlock({ uiManager, viewRegistry in
            let view = viewRegistry?[node]
            if view is RCTScrollableProtocol {
                let point: CGPoint = CGPoint(x: x, y: y)
                (view as? RCTScrollableProtocol?)??.scroll(toOffset: point, animated: animated)
            }
        })

    }

    override static func requiresMainQueueSetup() -> Bool {
      return false
    }
}
