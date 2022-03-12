const StatusCard: React.FC<{ text: string }> = ({ text }) => {
  return (
    <>
      {text === 'Approved' ? (
        <TooltipHolder
          title={text}
          tooltipText="Grant has been approved and funds were received"
          titleColor="green-800"
          bgColor="green-100"
        />
      ) : text === 'Declined' ? (
        <TooltipHolder
          title={text}
          tooltipText="Grant application has been denied"
          titleColor="red-700"
          bgColor="red-200"
        />
      ) : text === 'Missed Deadline' ? (
        <TooltipHolder
          title={text}
          tooltipText="Grant application was not completed before the close date"
          titleColor="yellow-800"
          bgColor="yellow-100"
        />
      ) : text === 'Pending' ? (
        <TooltipHolder
          title={text}
          tooltipText="Grant has been applied for and decision is pending"
          titleColor="blue-700"
          bgColor="blue-100"
        />
      ) : text === 'Incomplete' ? (
        <TooltipHolder
          title={text}
          tooltipText="Grant application has been started but is missing important information"
          titleColor="cyan-900"
          bgColor="cyan-200"
        />
      ) : text === 'Inactive' ? (
        <TooltipHolder
          title={text}
          tooltipText="Grant resources were fully used"
          titleColor="gray-800"
          bgColor="gray-300"
        />
      ) : (
        <TooltipHolder title={text} />
      )}
    </>
  );
};

const TooltipHolder: React.FC<{
  title: string;
  tooltipText?: string;
  titleColor?: string;
  bgColor?: string;
}> = ({ title, tooltipText, titleColor, bgColor }) =>
  titleColor && bgColor ? (
    <div className={`status-holder group bg-${bgColor}`}>
      <span className={`text-${titleColor}`}>{title}</span>
      {tooltipText && (
        <span className="status-tooltip group-hover:scale-100">
          {tooltipText}
        </span>
      )}
    </div>
  ) : (
    <div className="status-holder group">
      {title}
      {tooltipText && (
        <span className="status-tooltip group-hover:scale-100">
          {tooltipText}
        </span>
      )}
    </div>
  );

export default StatusCard;
