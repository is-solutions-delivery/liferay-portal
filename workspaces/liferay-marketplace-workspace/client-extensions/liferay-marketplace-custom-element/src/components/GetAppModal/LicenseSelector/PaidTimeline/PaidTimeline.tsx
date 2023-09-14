interface PaidTimelineProps {
  product? : Product;
}


export function PaidTimeline({product}:PaidTimelineProps){

  return(
      <div className="paid-timeline">
        <h1>{product?.id}</h1>
      </div>
  )
}