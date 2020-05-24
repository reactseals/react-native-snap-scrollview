import UIKit

@objc(SnapScrollView)
class SnapScrollView: RCTScrollView {
    private var snapPoints: [Int] = []
    private var alignFocusedViewY: Bool = false
    private var offsetFromFocusedView: Int = 0
    private var startSnapFromY: Int = 0

    override func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {
        if (snapPoints.count != 0) {
            let focusedView = UIScreen.main.focusedView
            let rect = CGRect(origin: CGPoint(x: 0, y: 0), size: CGSize(width: 0, height: 0))
            let buttonAbsoluteFrame = focusedView?.convert(focusedView?.bounds ?? rect, to: scrollView)
            let focusedViewOffsetFromTop = Int(buttonAbsoluteFrame?.minY ?? targetContentOffset.pointee.y)
            let maxOffsetY: CGFloat = scrollView.contentSize.height - scrollView.bounds.size.height + scrollView.contentInset.bottom;

            if (focusedViewOffsetFromTop >= startSnapFromY) {
                let closestPoint: CGFloat = CGFloat(snapPoints.reduce(snapPoints.first!) { abs($1 - focusedViewOffsetFromTop) < abs($0 - focusedViewOffsetFromTop) ? $1 : $0 })

                targetContentOffset.pointee = CGPoint(x: CGFloat(targetContentOffset.pointee.x), y: maxOffsetY < closestPoint ? maxOffsetY : (closestPoint - CGFloat(offsetFromFocusedView)))
                
            }
        }

        if (self.alignFocusedViewY == true) {
            let focusedView = UIScreen.main.focusedView
            if (focusedView != nil) {
                let rect = CGRect(origin: CGPoint(x: 0, y: 0), size: CGSize(width: 0, height: 0))
                let buttonAbsoluteFrame = focusedView?.convert(focusedView?.bounds ?? rect, to: scrollView)
                let focusedViewOffsetFromTop = Int(buttonAbsoluteFrame?.minY ?? targetContentOffset.pointee.y)
                let maxOffsetY: CGFloat = scrollView.contentSize.height - scrollView.bounds.size.height + scrollView.contentInset.bottom;
                let minY: CGFloat = CGFloat(focusedViewOffsetFromTop - offsetFromFocusedView);

                if (focusedViewOffsetFromTop >= startSnapFromY) {
                    targetContentOffset.pointee = CGPoint(x: CGFloat(targetContentOffset.pointee.x), y: CGFloat(maxOffsetY < minY ? maxOffsetY : minY))
                }
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

    @objc(setStartSnapFromY:)
    public func setStartSnapFromY(startSnapFromY: Int) {
        self.startSnapFromY = startSnapFromY
    }
}