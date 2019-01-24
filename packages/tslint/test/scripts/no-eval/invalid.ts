function invalidNoEval(obj: string){
	return eval(obj)
}

invalidNoEval("{a:(4-1), b:function(){}, c:new Date()}")
