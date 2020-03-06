class ResetPassword extends React.Component{
getCurrentDisplay(step){
if (step == "something") {
return (
<div></div>
)
}
}
render(){
return (<div>
{this.state.step == 1 && <div></div>}
{this.state.step == 2 && <div></div>}


</div>)

)
}
}
