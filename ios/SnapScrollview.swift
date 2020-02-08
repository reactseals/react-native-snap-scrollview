import UIKit

@objc(SnapScrollview)
class SnapScrollview: RCTScrollView {
    private var snapPoints: [Int] = []
    private var alignFocusedViewY: Bool = false
    private var offsetFromFocusedView: Int = 0

    override func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {

        let pointsArray = self.snapPoints

        if (pointsArray.count != 0) {
            let currentPointY = Int(targetContentOffset.pointee.y)
            let closestPoint = pointsArray.reduce(pointsArray.first!) { abs($1 - currentPointY) < abs($0 - currentPointY) ? $1 : $0 }

            targetContentOffset.pointee = CGPoint(x: CGFloat(targetContentOffset.pointee.x), y: CGFloat(closestPoint - offsetFromFocusedView))
        }

        if (self.alignFocusedViewY == true) {
            let focusedView = UIScreen.main.focusedView
            if (focusedView != nil) {
                let minY = (focusedView?.frame.minY ?? targetContentOffset.pointee.y) - CGFloat(offsetFromFocusedView);
                targetContentOffset.pointee = CGPoint(x: CGFloat(targetContentOffset.pointee.x), y: CGFloat(minY))
            }
        }
    }

    @objc(setSnapPoints:)
    public func setSnapPoints(snapPoints: NSArray) {
        self.snapPoints = snapPoints as! [Int]
    }

    @objc(setAlignFocusedViewY:)
    public func setAlignFocusedViewY(alignFocusedViewY: Bool) {
        self.alignFocusedViewY = alignFocusedViewY
    }

    @objc(setOffsetFromFocusedView:)
    public func setOffsetFromFocusedView(offsetFromFocusedView: Int) {
        self.offsetFromFocusedView = offsetFromFocusedView
    }
}
